# ICD-11 Interface
The ICD-11 Interface contains a few proof-of-concept use cases for the ICD-API. This project is developed by Andy Zhao, under the supervision of and in conjunction with Dr. Harvey Lui and Dr. Tim Lee from the BC Cancer Research Institute.
This interface uses Python Flask and the ICD-API to standardize nomenclature and identification for disease names. 

The ICD-11 Interface is hosted on [icddatabase.herokuapp.com](http://icddatabase.herokuapp.com). Images are hosted publicly, so be careful with uploading sensitive/confidential images. Images are hosted ephemerally, so they will not stay persistent over time.

The ICD-11 Interface contains three user stories:
## /quiz
The quiz is a proof of concept that uses the ICD-API's search functionality to search and validate answers in a quiz format.
## /submit
The submission page is an interface for users to upload images of skin disease to an open-source database. Image diagnoses can then be verified, or fraudulent/spam images can be deleted from the /verify page.
## /verify
The verify page is a portal for medical professionals to review submitted and uploaded images. This page acts as a gallery, where doctors can view each image and either verify the attached diagnosis, or reassign a more correct diagnosis to the image. Fraudulent or spam images can also be deleted from this page.

## Technologies
The ICD-11 Interface is built on Python Flask, using the ICD-API. The **/submit** and **/verify** contexts host images and metadata using SQL. A custom library for creating and managing in-memory zip files was also used, alongside spell-check and natural language processing libraries to construct the ICD-API queries. This project also uses the JSON library for packaging metadata for client-side interactions.

The ICD-API is a tool created by the World Health Organization.
