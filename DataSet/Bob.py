import joblib
from sklearn.ensemble import RandomForestClassifier



rfc = RandomForestClassifier(n_estimators=100, random_state=42)



def predict(features):
    # Your machine learning model implementation
    # Return the prediction based on the input features
    Model = joblib.load('Bob.pkl')

