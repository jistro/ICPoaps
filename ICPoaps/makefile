.PHONY: all clean build start-testnet deploy-backend deploy-frontend deploy view-frontend update-backend update-frontend update

start-testnet:
	sudo dfx start --clean

deploy-backend:
	sudo dfx deploy ICPoaps_backend

deploy-frontend:
	sudo dfx deploy ICPoaps_frontend

deploy:
	sudo dfx deploy

view-frontend:
	npm start

update-backend:
	sudo dfx deploy ICPoaps_backend

update-frontend:
	sudo dfx deploy ICPoaps_frontend

update:
	sudo dfx deploy
