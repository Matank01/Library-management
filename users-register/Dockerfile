FROM python:3.9
WORKDIR /usr/src/app
COPY app.py .
RUN pip install flask pymongo
EXPOSE 5000
CMD ["python", "app.py"]