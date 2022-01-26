const superTest = require("supertest");
const expect = require("chai").expect;
const env = require('../env');
const request = superTest(env.url);

describe("Un-authenticated", function () {

    it("Get /gists", async function () {
        const response = await request.get(`/gists?per_page=1`)
            .set('User-Agent', 'GistsAPI')
            .set('Content-Type', 'application/vnd.github.v3+json');
        //.send(requestBody);
        expect(response.status).to.eql(200);
    });

})

describe("Authenticated", function () {
    let gistId;
    const requestBody = {
        "description": "Hello World Examples",
        "public": true,
        "files": {
            "Hello World": {
                "content": "This is a file"
            }
        }
    }

    const updateBody = {
        "description": "UpdatedHello World Examples",
        "public": true,
        "files": {
            "Hello World": {
                "content": "This is an update"
            }
        }
    }
    it("Post /gists", async function () {
        const response = await request.post(`/gists`)
            .set('User-Agent', 'GistsAPI')
            .set('Authorization', `Bearer ${env.token}`)
            .set('Content-Type', 'application/vnd.github.v3+json')
            .send(requestBody);

        gistId = response.body.id;
        expect(response.status).to.eql(201);
    });

    it("Get /gist/${gistId}", async function () {
        const response = await request.get(`/gists/${gistId}`)
            .set('User-Agent', 'GistsAPI')
            .set('Authorization', `Bearer ${env.token}`)
            .set('Content-Type', 'application/vnd.github.v3+json');

        expect(response.status).to.eql(200);
        expect(response.body.id).to.eql(gistId)
    });

    it("Patch /gist/${gistId}", async function () {
        const response = await request.patch(`/gists/${gistId}`)
            .set('User-Agent', 'GistsAPI')
            .set('Authorization', `Bearer ${env.token}`)
            .set('Content-Type', 'application/vnd.github.v3+json')
            .send(updateBody);

        //console.log(response.body);
        expect(response.status).to.eql(200);
    });

    it("Delete /gist/${gistId}", async function () {
        const response = await request.delete(`/gists/${gistId}`)
            .set('User-Agent', 'GistsAPI')
            .set('Authorization', `Bearer ${env.token}`)
            .set('Content-Type', 'application/vnd.github.v3+json');

        console.log(response.body);
        expect(response.status).to.eql(204);
    });

})