# Songify App 5
A music to GIF converter

## Requirements

First, you need to have Node.js and NPM installed. Ideally, you're using a linux system or
Window Subsystem for Linux, but the environment still works on Window, with some possible limitations.

So, to install Node.js, you need to run the following commands:
```
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
```

Then install the Node.js package like so:
```
sudo apt-get install -y nodejs
```

Or, simply visit the website and follow the steps provided.

https://nodejs.org/en/


## Installation

You will first need to clone the repo by running the following command:
```
git clone https://github.com/gultar/songifyapp5
```

Then you need to install all necessary dependencies:
```
npm install
```

You will also need to add your API keys for Genius and Giphy to a .env file at the root of the project like so :

VITE_CLIENT_ID="..."
VITE_CLIENT_SECRET="..."
VITE_SESSION_TOKEN="..."
VITE_GIPHY_API_KEY="..."

## Running

You can start the application by running the command:
```
npm run dev
```

Built by:

Sacha-Olivier Dulac

