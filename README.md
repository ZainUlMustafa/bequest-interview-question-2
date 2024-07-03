# Tamper Proof Data

At Bequest, we require that important user data is tamper proof. Otherwise, our system can incorrectly distribute assets if our internal server or database is breached. 

**1. How does the client ensure that their data has not been tampered with?**
<br />
The client ensures that their data has not been tampered with by using cryptographic hash functions. Each time the data is updated, a hash of the data is generated and stored. When the data is fetched, the stored hash is retrieved, and the client can request the server to verify the integrity of the data by comparing the stored hash with a newly generated hash of the current data. If the hashes match, the data is confirmed to be untampered.
<br />
<br />
**2. If the data has been tampered with, how can the client recover the lost data?**
<br />
If the data has been tampered with, the client can recover the lost data by utilizing a backup mechanism implemented on the server. Each time the data is updated, a backup of the data, including its hash, is saved. In case of tampering, the client can send a request to the server to restore the data from the last backup, ensuring that the data is reverted to its last known good state before the tampering occurred.
<br />

Edit this repo to answer these two questions using any technologies you'd like, there any many possible solutions. Feel free to add comments.

### To run the apps:
```npm run start``` in both the frontend and backend

## To make a submission:
1. Clone the repo
2. Make a PR with your changes in your repo
3. Email your github repository to robert@bequest.finance
