import pandas as pd
import numpy as np 
import joblib
import matplotlib.pyplot as plt
from sklearn.preprocessing import LabelEncoder
from sklearn.preprocessing import OneHotEncoder
from sklearn.model_selection import train_test_split
# random forest
from sklearn.ensemble import RandomForestClassifier
# metrics
from sklearn.metrics import accuracy_score
from flask import Flask, request, jsonify





df = pd.read_csv(r'C:\Users\ahmed\OneDrive\Desktop\Semester5\Software-Proj\Back\HelpDesk-Backend\DataSet\trainingData.csv')



Label_encoder = LabelEncoder()

df['Type'] = Label_encoder.fit_transform(df['Type'])
df['Priority'] = Label_encoder.fit_transform(df['Priority'])

df['Agent']= Label_encoder.fit_transform(df['Agent'])

print("####################")



print(df.iloc[:10,:])
print(df.columns)
X = df[['Priority','Type']] 
y = df[['Agent']]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)


rfc = RandomForestClassifier(n_estimators=100, random_state=42)
model = rfc.fit(X_train, y_train)
print("##################")
# print(X_test)
y_pred = rfc.predict(X_test)
#print(y_pred)
print("##################")

print(rfc.predict_proba([[2,2]]))

accuracy = accuracy_score(y_test, y_pred)


print("Accuracy: %.2f%%" % (accuracy * 100.0))
joblib.dump(model,'Bob.pkl')

