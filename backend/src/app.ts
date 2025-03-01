import express from 'express';
import BlueskyClient from './blueskyClient';
import muteRepository, { Mute } from './muteRepository';
const app = express();
app.use(express.json());
app.use(express.urlencoded());
const port = 3000;

const client = new BlueskyClient();
var initalize = async () => await client.login("arkanoia43028@gmail.com", "Lavakia123@");
initalize();



type muteReason = {
    reason: string,
    muteUri: string
}

/*

// mysql table
create table mutes
(
    handle  VARCHAR (200) NOT NULL,
    did  VARCHAR (200) NOT NULL,
    date  VARCHAR (200) NOT NULL,
    reason VARCHAR(200) NOT NULL,
    reasonUri VARCHAR(200) NOT NULL,
    unique (handle, reasonUri)
);
*/
const repository = new muteRepository();


app.get('/mutes', async (req, res)=> {
    await repository.connect();
    let water = await repository.readAll();
    res.send(water[0]);
}) 

app.get('/mutes/aggregate', async (req, res)=> {
    await repository.connect();
    let water = await repository.readAllAggregate();
    res.send(water[0]);
}) 

app.get('/user/:userId/posts/:postId', async (req, res)=> {
    let userId = req.params.userId;
    let postId = req.params.postId;
    let resp = await client.getPostDetails(userId, postId);

    res.send(resp);
}) 

app.get('/user/:userId/posts/:postId/reposted_by', async (req, res)=> {
    let userId = req.params.userId;
    let postId = req.params.postId;
    let resp = await client.getRepostedBy(userId, postId);

    res.send(resp)
})


app.get('/', async (req, res) => {
    await client.login("arkanoia43028@gmail.com", "Lavakia123@");
    res.send('Hello World!');
});

app.post('/user/:userId/posts/:postId/reposted_by/mute', async (req, res) => {
    let userId = req.params.userId;
    let postId = req.params.postId;
    let muteReason = req.body as muteReason;
    let repostedBy = await client.getRepostedBy(userId, postId);

    let mutes = repostedBy.map(user => { return {handle: user.handle, did: user.did, date: new Date(Date.now()).toDateString(), reason: muteReason.reason, reasonUri: muteReason.muteUri}})
    
    await repository.connect();
    for (let mute of mutes) {
        await repository.insert(mute as Mute);
    }
    res.send(mutes)
})

app.post('/user/:userId/followers/mute', async (req, res) => {
    let userId = req.params.userId;
    let muteReason = req.body as muteReason;
    let profile = await client.getProfile(userId);
    let did = profile.data.did;

    let followers = await client.getFollowers(did);
    let mutes = followers.map(user => { return {handle: user.handle, did: user.did, date: new Date(Date.now()).toDateString(), reason: muteReason.reason, reasonUri: muteReason.muteUri}})

    
    await repository.connect();
    for (let mute of mutes) {
        await repository.insert(mute as Mute);
    }
    

    res.send(mutes)
})


app.get('/user/:userId', async (req, res) => {
    let userId = req.params.userId;
    let followers = await client.getProfile(userId);
    res.send(followers)
})

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
