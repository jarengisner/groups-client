import { useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Navigation } from '../navigation/navigation.component';
import { ClubPreviewInfo } from '../club-preview-component/club-info';
import { MemberList } from '../club-preview-component/member-list';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { Posts } from './post-section.component';

export const MemberView = ({ user }) => {
  /*
  Start implementing the same logic here that we used in the club preview for finding
  the club based off of the URL param, and then we can fetch it in exactly the same manner

  Then we need to carve out a good posts section and make sure that we can post things, then move on to likes, etc.
  */
  const [posts, setPosts] = useState([]);
  const [club, setClub] = useState(null);
  const [currentlyLiked, setCurrentlyLiked] = useState([]);

  const { groupname } = useParams();

  useEffect(() => {
    fetch(`http://localhost:8080/clubs/${groupname}`)
      .then((res) => res.json())
      .then((data) => {
        setClub(data);
        setPosts(data.posts);
        /* console.log(data);
        console.log(data.posts); */
      })
      .catch((err) => {
        console.log(err);
        console.log('There was an error loading posts/assigning club');
      });
  }, [posts, groupname]);

  /*  const unlikeHandler = (id, groupname, postIndex) => {
    //Need to make a handler that will handle un-liking the post
    let filteredLikes = currentLikes.filter((i) => i !== id);
    setCurrentLikes(filteredLikes);
  };  */

  const likeHandler = (id, groupname, postIndex, postId) => {
    const likeData = {
      userId: id,
      groupname: groupname,
      postIndex: postIndex,
    };

    setCurrentlyLiked((prevLikes) => [...prevLikes, postId]);

    fetch('http://localhost:8080/posts/like', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(likeData),
    })
      .then((res) => res.json())
      .then((data) => console.log(data));

    console.log('currentLikes ' + currentlyLiked);
  };

  const unlikeHandler = (id, groupname, postIndex, postId) => {
    const unlikeData = {
      userId: id,
      groupname: groupname,
      postIndex: postIndex,
    };

    let filteredCurrentLikes = currentlyLiked.filter((like) => like !== postId);

    setCurrentlyLiked(filteredCurrentLikes);

    fetch('http://localhost:8080/posts/unlike', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(unlikeData),
    })
      .then((res) => res.json())
      .then((data) => console.log(data));

    console.log('currentLikes ' + currentlyLiked);
  };

  return (
    <Container>
      <Row>
        <Col sm={12} md={9}>
          {/* This is gonna be the club preview, nothing else needs to be added here */}
          <>
            {club ? (
              <ClubPreviewInfo club={club} user={user} />
            ) : (
              <p>Loading....</p>
            )}
          </>
          <div>
            {/* the actual posts section will be here, this will be a very in depth area */}
            <Posts
              user={user}
              posts={posts}
              groupname={groupname}
              currentlyLiked={currentlyLiked}
              likeHandler={likeHandler}
              unlikeHandler={unlikeHandler}
            />
          </div>
        </Col>
        <Col sm={12} md={3}>
          {/* member list here just like in the preview */}
          <>{club ? <MemberList club={club} /> : <p>Loading...</p>}</>
        </Col>
      </Row>
    </Container>
  );
};
