//During the test the env variable is set to test
let mongoose = require("mongoose");
//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
const postSchema = require("../models/Post");
const Post = mongoose.model("Post", postSchema);
let should = chai.should();

chai.use(chaiHttp);
describe('Posts', () => {
	beforeEach((done) => { 
		Post.remove({}, (err) => {
			done();
		});
	});

	describe('/GET post', () => {
		it('it should GET all the posts', (done) => {
			chai.request(server)
				.get('/api/posts')
				.end((err, res) => {
					res.should.have.status(403);
					res.body.should.be.a('object');
					res.body.message.should.be.eql("Unauthorized");
					done();
				});
		});
	});

});
