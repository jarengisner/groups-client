import { useState } from 'react';
import { Container, Button, Row, Card, Tabs, Tab } from 'react-bootstrap';
import { useEffect } from 'react';
import { CreatePost } from './create-post-modal.component';
import moment from 'moment';
import { ClipLoader } from 'react-spinners';

import { UserVisit } from './user-profile-visitor.component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

//style
import '../../index.css';

export const Posts = ({
  user,
  posts,
  groupname,
  currentlyLiked,
  likeHandler,
  unlikeHandler,
}) => {
  const [currentPosts, setCurrentPosts] = useState([]);
  const [show, setShow] = useState(false);
  const [key, setKey] = useState('All');
  const [empty, setEmpty] = useState(false);

  //States used for user profile visit modal
  const [visitTarget, setVisitTarget] = useState(null);
  const [userShow, setUserShow] = useState(false);

  const openModal = () => {
    setShow(true);
  };

  const handleModalClose = () => {
    setShow(false);
  };

  //User preview modal below

  const openUserModal = (event) => {
    const visitTarget = event.target.textContent;
    let userData = {
      username: '',
      bio: '',
      profilePic: '',
    };

    fetch(`https://groups-api-6de9bfaff2b7.herokuapp.com/users/${visitTarget}`)
      .then((res) => res.json())
      .then((data) => {
        userData.username = data.username;
        userData.bio = data.bio;
        userData.profilePic = data.profilePic;

        setVisitTarget(userData);
      });

    setUserShow(true);
  };

  const userCloseHandle = () => {
    setUserShow(false);
  };

  useEffect(() => {
    setCurrentPosts(posts);
  }, [posts]);

  useEffect(() => {
    setTimeout(() => {
      if (currentPosts.length === 0) {
        setEmpty(true);
      }
    }, 2000);
  }, [currentPosts.length]);

  return (
    <Container className='postDiv'>
      <Row style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Button onClick={openModal} style={{ width: '50%', marginTop: 15 }}>
          create post
        </Button>
      </Row>
      <Tabs
        id='controlled-tab-example'
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className='mb-3'
      >
        <Tab eventKey='All' title='All Posts'>
          <div>
            {currentPosts.length > 0 ? (
              posts.map((post, index) => (
                <Row style={{ marginTop: 15, marginBottom: 15 }} key={post.id}>
                  <Card className='group-post-card'>
                    {post.postImg ? <img src={post.postImg} alt='Po' /> : null}
                    <div className='post-content'>
                      <button
                        className='post-user-text'
                        onClick={openUserModal}
                      >
                        {post.postUser}
                      </button>
                      <p>{post.postBody}</p>
                      <p>{moment(post.date).format('MM/DD/YYYY')}</p>
                    </div>
                    <div>
                      {currentlyLiked.includes(post.id) ||
                      post.likedBy.includes(user.username) ? (
                        <button className='like-button'>
                          <FontAwesomeIcon
                            icon={faHeart}
                            className='heart-button like-button-already-liked'
                            onClick={() =>
                              unlikeHandler(
                                user.username,
                                groupname,
                                index,
                                post.id
                              )
                            }
                          />
                        </button>
                      ) : (
                        <button className='like-button'>
                          <FontAwesomeIcon
                            icon={faHeart}
                            className='heart-button'
                            onClick={() =>
                              likeHandler(
                                user.username,
                                groupname,
                                index,
                                post.id
                              )
                            }
                          />
                        </button>
                      )}
                    </div>
                  </Card>
                </Row>
              ))
            ) : empty ? (
              <h1 style={{ color: 'white' }}>Group has no posts</h1>
            ) : (
              <div>
                <ClipLoader color='#36D7B7' size={50} />
              </div>
            )}
          </div>
        </Tab>
        <Tab eventKey='User' title='My Posts'>
          <div>
            {currentPosts
              .filter((post) => post.postUser === user.username)
              .map((filteredPost) => (
                <Row
                  style={{ marginTop: 15, marginBottom: 15 }}
                  key={filteredPost.id}
                >
                  <Card>
                    {filteredPost.postImg ? (
                      <img src={filteredPost.postImg} alt='Po' />
                    ) : null}
                    <div className='post-content'>
                      <button
                        className='post-user-text'
                        onClick={openUserModal}
                      >
                        {filteredPost.postUser}
                      </button>
                      <p>{filteredPost.postBody}</p>
                      <p>{moment(filteredPost.date).format('MM/DD/YYYY')}</p>
                    </div>
                  </Card>
                </Row>
              ))}
          </div>
        </Tab>
      </Tabs>
      <CreatePost
        show={show}
        closeHandle={handleModalClose}
        user={user}
        groupname={groupname}
      />

      <UserVisit
        userCloseHandle={userCloseHandle}
        show={userShow}
        user={visitTarget}
      />
    </Container>
  );
};
