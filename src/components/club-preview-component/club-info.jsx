import { Button, Card } from 'react-bootstrap';
import '../../index.css';
import { useState } from 'react';

export const ClubPreviewInfo = ({ club, user }) => {
  //may be used to display an error or success message for the users
  const message = useState('');
  const name = club.name;
  console.log(name);
  const userId = user.username;
  const members = club.members;

  const joinHandle = () => {
    fetch(`http://localhost:8080/clubs/join/${name}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: {
        username: JSON.stringify(userId),
      },
    })
      .then((res) => res.json)
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
        console.log('There was an error when joining the group');
      });
  };

  const leaveHandle = () => {
    fetch(`http://localhost:8080/clubs/${name}/${userId}/leave`, {
      method: 'PUT',
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
        console.log('There was an error leaving the group');
      });
  };

  const memCheck = (members, userId) => {
    let filter = members.filter((item) => item.username === userId);

    if (filter.length > 0) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div>
      <Card>
        <img src={club.groupImg} className='profilePic' alt='pic'></img>
        <Card.Title>{club.name}</Card.Title>
        <Card.Subtitle>{club.description}</Card.Subtitle>
        <div>
          <p>This will contain a carousel of the books from the club</p>
          <>
            {!club.members.some((member) => member.username === userId) ? (
              <Button
                style={{ width: '33%' }}
                variant='outline-dark'
                onClick={joinHandle}
              >
                Join
              </Button>
            ) : (
              <Button
                variant='outline-danger'
                style={{ width: '33%' }}
                onClick={leaveHandle}
              >
                Leave Group
              </Button>
            )}
          </>
        </div>
      </Card>
    </div>
  );
};
