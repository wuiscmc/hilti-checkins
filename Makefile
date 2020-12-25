build:  
	@docker build . --target backend --tag hilti-backend
	@docker build . --target frontend --tag hilti-frontend

backend:
	@docker run -p 8080:80 hilti-backend 

frontend:
	@docker run -p 8081:80 hilti-frontend
