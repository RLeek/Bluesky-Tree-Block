import { AtpAgent } from '@atproto/api'
import { PostView } from '@atproto/api/dist/client/types/app/bsky/feed/defs';

class BlueskyClient {
    agent: AtpAgent;

    constructor() {
        this.agent = new AtpAgent({ service: 'https://bsky.social' });
    }

    public async login(username:string, password:string) {
        return await this.agent.login({
            identifier: username,
            password: password
        });
    }

    public async getPostDetails(userId: string, postId:string) {
        let uri = `at://${userId}/app.bsky.feed.post/${postId}`
        let resp = await this.agent.getPostThread({uri: uri});
        let post:PostView = resp.data.thread.post as PostView;

        return {uri:post.uri, cid:post.cid}
    }

    public async getRepostedBy(userId: string, postId:string) {
        let users = []
        let resp = await this.getPostDetails(userId, postId);
        let resp1 = await this.agent.getRepostedBy({uri:resp.uri, cid: resp.cid, limit:50})
        users = users.concat(resp1.data.repostedBy);
        let cursor = resp1.data.cursor
        while(cursor != null) {
            resp1 = await this.agent.getRepostedBy({uri:resp.uri, cid: resp.cid, limit:100, cursor:cursor})
            await delay(100);
            users = users.concat(resp1.data.repostedBy);
            cursor = resp1.data.cursor 
        }
        return users
    }

    public async getProfile(actor) {
        let uri = `${actor}`;
        let resp = await this.agent.getProfile({actor:uri});
        return resp;
    }

    public async getFollowers(did) {
        let followers = []
        // get the followers
        let resp = await this.agent.getFollowers({actor:did, limit:100});
        followers = followers.concat(resp.data.followers);
        let cursor = resp.data.cursor;
        while(cursor != null) {
            for (let follower of resp.data.followers) {
                console.log(follower.did)
            }
            resp = await this.agent.getFollowers({actor:did, cursor: cursor, limit:100});
            await delay(100);
            followers = followers.concat(resp.data.followers);
            cursor = resp.data.cursor;
        }
        return followers
    }
}

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

export default BlueskyClient