import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'  # Suppress TensorFlow INFO and WARNING logs

from flask import Flask, jsonify, request, g
import google.generativeai as genai
from functions.question_generation import generate_questions
# from functions.emotion_analysis import analyze_fun
from functions.review_generation import gen_review
from flask_cors import CORS, cross_origin
from models import db, User, Interview, Question, Review
from flask_bcrypt import Bcrypt
import jwt
from datetime import datetime, timedelta

# Create instance directory if it doesn't exist
instance_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'instance')
os.makedirs(instance_path, exist_ok=True)

app = Flask(__name__, instance_path=instance_path)
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "expose_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True,
        "max_age": 120  # Cache preflight requests for 2 minutes
    }
})

# Database configuration with absolute path
db_path = os.path.join(instance_path, 'mock_interview.db')
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your-secret-key-here'  # Change this to a secure key
app.config['JWT_EXPIRATION_DELTA'] = timedelta(days=1)  # Token expires in 1 day

# Initialize extensions
db.init_app(app)
bcrypt = Bcrypt(app)

# Create database tables
with app.app_context():
    db.create_all()

# Initialize the Generative AI model and chat session globally
gemini_api_key  = " # put gemeni api key here "
genai.configure(api_key=gemini_api_key)

model = genai.GenerativeModel(model_name="gemini-1.5-flash")
@app.before_request
def before_request():
    g.model = model

@app.route('/api/get-questions', methods=['POST'])
def ask_questions():
    try:
        data = request.get_json()
        job_role = data['job_role']
        experience_lvl = data['experience_lvl']
        response = generate_questions(job_role, experience_lvl)

        # if not list then error
        if not isinstance(response, list):
            return jsonify({'errorMsg': response}), 400
        else: # success
            return jsonify({'job_role' : job_role, 'exp_level' : experience_lvl, 'qtns': response}), 200
    except Exception as e:
        print(f"Error occurred while generating question: {e}")
        return jsonify({'errorMsg': "Something went wrong"}), 400


@app.route('/api/get-review', methods=['POST'])
def get_review():
    try:
        data = request.get_json()
        job_role = data['job_role']
        qns = data['qns']
        ans = data['ans']
        emotion = data['emotion']
        suspiciousCount = data['suspiciousCount']
        interview_id = data.get('interview_id')

        if not interview_id:
            return jsonify({'errorMsg': 'Interview ID is required'}), 400

        # Check if interview exists
        interview = Interview.query.get(interview_id)
        if not interview:
            return jsonify({'errorMsg': 'Interview not found'}), 404

        # Get review
        review = gen_review(job_role, qns, ans, emotion, suspiciousCount)

        # Extract last few lines from review
        review_lines = review.split('\n')
        summary = '\n'.join(review_lines[-7:]) if len(review_lines) > 7 else review

        # Save review to database
        new_review = Review(
            interview_id=interview_id,
            feedback_text=summary,
            overall_score=0.0,
            technical_score=0.0,
            communication_score=0.0,
            confidence_score=0.0
        )
        db.session.add(new_review)
        db.session.commit()

        return jsonify({'review': review})
    except Exception as e:
        print(f"Error occurred while generating review: {e}")
        db.session.rollback()
        return jsonify({'errorMsg': "Something went wrong"}), 400


# Emotion analysis using backend, not used anymore
# @app.route('/api/analyze-emotions', methods=['POST'])
# def analyze_emotions():
#     try:
#         data = request.get_json()
#         frames = data['frames']
#         response = analyze_fun(frames)

#         return jsonify({'response': response})
#     except Exception as e:
#         print(f"Error occurred while generating emotion analysis data: {e}")
#         return jsonify({'errorMsg': "Something went wrong"}), 400


# Not used anymore since emotion analysis done in front end itself
# @app.route('/api/get-review-old', methods=['POST'])
# def get_review_old():
#     try:
#         data = request.get_json()
#         job_role = data['job_role']
#         # experience_lvl = data['experience_lvl']
#         qns = data['qns']
#         ans = data['ans']
#         frames = data['frames']

#         # get emotion analysis
#         emotion = analyze_fun(frames)

#         # get review
#         review = gen_review(job_role,qns,ans,emotion)

#         return jsonify({'response': review})
#     except Exception as e:
#         print(f"Error occurred while generating review: {e}")
#         return jsonify({'errorMsg': "Something went wrong"}), 400


@app.route('/api/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        print("Received payload:", data)  # Debugging log
        
        # Check if required fields are present
        if not all(key in data for key in ['fullName', 'username', 'email', 'password']):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Check if user already exists
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already registered'}), 409
        
        if User.query.filter_by(username=data['username']).first():
            return jsonify({'error': 'Username already taken'}), 409
        
        # Create new user
        new_user = User(
            username=data['username'],
            email=data['email']
        )
        new_user.set_password(data['password'])
        
        # Save to database
        db.session.add(new_user)
        db.session.commit()
        
        return jsonify({
            'message': 'User registered successfully',
            'user': {
                'fullName': data['fullName'],
                'username': data['username'],
                'email': data['email']
            }
        }), 201
        
    except Exception as e:
        print(f"Error in /api/signup: {e}")  # Debugging log
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/api/login', methods=['POST'])
@cross_origin()  # Explicitly allow cross-origin requests
def login():
    try:
        data = request.get_json()
        print("Received payload:", data)  # Debugging log
        username_or_email = data.get('username')
        password = data.get('password')

        # Check if the user exists by username or email
        user = User.query.filter((User.username == username_or_email) | (User.email == username_or_email)).first()

        if user and user.check_password(password):  # Verify the password
            # Generate a JWT token (optional, for session management)
            token = jwt.encode(
                {'user_id': user.id, 'exp': datetime.utcnow() + app.config['JWT_EXPIRATION_DELTA']},
                app.config['SECRET_KEY'],
                algorithm='HS256'
            )
            # Return complete user details
            return jsonify({
                'message': 'Login successful',
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email
                },
                'token': token
            }), 200
        else:
            return jsonify({'message': 'Invalid username/email or password'}), 401

    except Exception as e:
        print(f"Error in /api/login: {e}")  # Debugging log
        return jsonify({'message': 'An error occurred'}), 500

@app.route('/api/get-user-details', methods=['GET'])
def get_user_details():
    try:
        # Get the user ID from the JWT token
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'No token provided'}), 401

        # Decode the token to get the user ID
        decoded_token = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        user_id = decoded_token.get('user_id')

        # Get the user details from the database
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404

        return jsonify({'user': user.to_dict()}), 200
    except Exception as e:
        print(f"Error in /api/get-user-details: {e}")
        return jsonify({'error': 'An error occurred'}), 500

                            
def verify_token(token):
    try:
        decoded = jwt.decode(token.split(' ')[1], app.config['SECRET_KEY'], algorithms=['HS256'])
        return decoded['user_id']
    except:
        return None

@app.route('/api/interviews', methods=['GET', 'OPTIONS'])
@cross_origin()
def get_interviews():
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,OPTIONS')
        return response

    try:
        token = request.headers.get('Authorization')
        user_id = verify_token(token)
        if not user_id:
            return jsonify({'error': 'Unauthorized'}), 401

        # Simpler query approach
        interviews = Interview.query.filter_by(user_id=user_id).all()
        interview_list = [
            {
                'id': interview.id,
                'job_role': interview.job_role,
                'experience_level': interview.experience_level,
                'status': interview.status,
                'created_at': interview.created_at.isoformat() if interview.created_at else None,
                'feedback_summary': interview.review.feedback_text if interview.review else None
            }
            for interview in interviews
        ]

        return jsonify(interview_list)
    except Exception as e:
        print(f"Error fetching interviews: {e}")  # Debug log
        return jsonify({'error': 'Failed to fetch interviews'}), 500

@app.route('/api/save-interview', methods=['POST', 'OPTIONS'])
@cross_origin()
def save_interview():
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'POST,OPTIONS')
        return response

    try:
        data = request.get_json()
        user_id = data.get('user_id')
        job_role = data.get('job_role')
        experience_level = data.get('experience_level')
        status = data.get('status', 'completed')

        if not user_id or not job_role or not experience_level:
            return jsonify({'errorMsg': 'Missing required fields'}), 400

        new_interview = Interview(
            user_id=user_id,
            job_role=job_role,
            experience_level=experience_level,
            status=status
        )

        db.session.add(new_interview)
        db.session.commit()

        return jsonify({
            'message': 'Interview saved successfully', 
            'interview_id': new_interview.id
        }), 201

    except Exception as e:
        print(f"Error saving interview: {e}")
        db.session.rollback()
        return jsonify({'error': 'Failed to save interview'}), 500

if __name__ == '__main__':
    app.run(debug=True)

@app.route('/api/interview-counts', methods=['GET'])
def get_interview_counts():
    try:
        # Query to count interviews for each user
        interview_counts = db.session.query(
            User.id,
            db.func.count(Interview.id).label('interview_count')
        ).join(Interview, User.id == Interview.user_id).group_by(User.id).all()

        # Convert the result to a list of dictionaries
        result = [{'user_id': user_id, 'interview_count': count} for user_id, count in interview_counts]

        return jsonify(result), 200
    except Exception as e:
        print(f"Error occurred while fetching interview counts: {e}")
        return jsonify({'errorMsg': "Something went wrong"}), 500
