.PHONY: help setup dev build test clean phase-alpha phase-beta phase-nexus

help:
	@echo "Available commands:"
	@echo "  make setup      - Install all dependencies"
	@echo "  make dev        - Run development servers"
	@echo "  make build      - Build all packages"
	@echo "  make test       - Run all tests"
	@echo "  make clean      - Remove node_modules"
	@echo "  make phase-alpha - Switch to Alpha phase"
	@echo "  make phase-beta  - Switch to Beta phase"
	@echo "  make phase-nexus - Switch to Nexus phase"

setup:
	npm run setup

dev:
	npm run dev

build:
	npm run build

test:
	npm run test

clean:
	npm run clean

phase-alpha:
	npm run phase:alpha

phase-beta:
	npm run phase:beta

phase-nexus:
	npm run phase:nexus

docker-up:
	npm run docker:up

docker-down:
	npm run docker:down