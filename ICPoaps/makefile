.PHONY: help start-testnet deploy-backend deploy-frontend deploy view-frontend update-backend update-frontend update

help:
	@echo "all commands except view-frontend require sudo"
	@echo "  start-testnet   -- to start the local testnet"
	@echo "  deploy-backend  -- to deploy the backend canister"
	@echo "  deploy-frontend -- to deploy the frontend canister (and the backend canister)"
	@echo "  deploy          -- to deploy the full application"
	@echo "  view-frontend   -- to view the frontend canister using npm"
	@echo "  update-backend  -- to update the backend canister"
	@echo "  update-frontend -- to update the frontend canister"
	@echo "  update          -- to update the full application"

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
