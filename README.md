# Aegis Pluvia
  Turning Climate Data into Action for a Safer Future.

## Requirements

Before you start, make sure you have the following requirements installed on your machine:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [Git](https://git-scm.com/)

## Installation instructions

Follow these steps to set up and run the project:

1.Clone the repository:

```bash
git clone git@github.com:hackDosCria/Aegis-Pluvia-Project.git
```
2.Navigate to the project folder:

  ```bash
  cd Aegis-Pluvia-Project
```
3.Install the dependencies:
   
  ```bash
  npm install
  ```  
4.Start the local development server:
  
  ```bash
  node server.js
```

Open your browser and go to http://localhost:3000 to see the application running.

- http://localhost:3000/
  - para ver grafico 
- http://localhost:3000//accountInfo/:accountPublicKeyHere
  - to query information for a specific account, add the Public Key number in place of :accountPublicKeyHere
- http://localhost:3000/programAccounts/:programPublicKey
  - para consultar todas as contas pertencentes ao programa fornecido Pubkey
- http://localhost:3000/block/:blockNumberHere
  - to query that particular block, add the block number in place of :BlockNumberHere


### Contact
If you have any questions or need help, please contact us at aegispluvia@gmail.com.
