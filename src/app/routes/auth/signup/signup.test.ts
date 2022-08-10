
import request from 'supertest';
import AppModule from '../../../index';
import { wrapper } from '../../../models';
import dbService from '../../../services/db';
import { userStubModel } from '../../../tests/user.stub';

const userStub = userStubModel
const rq = request(AppModule); 
var UserWrapper:any= undefined;

describe("responds to /auth/password",()=>{
    beforeAll(async()=>{
        /** Load the test database */
        await dbService.loadDatabase(true);
        /** Load the collections wrapper */
        UserWrapper = new wrapper.user();
        return;
    })

    /** delete user already created for testing */
    afterAll(async()=>{
        return await UserWrapper.delete({email:userStub.email});
    })

    /** Create for the first time a new user */
    it("Create a new user", async()=>{
        /** send user create request */
        const res = await rq.post('/auth/signup/email').send(userStub);
        /** check the response content type */
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        /** check the response status code */
        expect(res.statusCode).toBe(201);
    })

    /** Try to create a user that already exists */
    it("Create an existing user", async()=>{
        /** Send user create request */
        const res = await rq.post('/auth/signup/email').send(userStub);
        /** Check the response content type */
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        /** Check the response status code */
        expect(res.statusCode).toBe(400);
        /** Check if body response is error*/
        expect(res.body).toEqual( [ 'USER_ALREADY_EXISTS' ])
    })
})