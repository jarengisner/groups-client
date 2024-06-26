import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Card, Col, Row, Dropdown } from 'react-bootstrap';
import { Profile } from '../profile-component/profile.component';

import { Login } from '../login/login.component';
import { Registration } from '../register/registration.component';
import { GroupList } from '../group-list-component/group-list.component';
import { ClubPreview } from '../club-preview-component/club-preview.component';
import { MemberView } from '../club-member-view/club-member-view.component';
import { Navigation } from '../navigation/navigation.component';
import { Recommendation } from './recommended.component';
import { CreateGroup } from '../create-group/create-group.component';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

import '../../index.css';

export const MainView = () => {
  //State to check user and token for security
  //not working
  const storedUser = localStorage.getItem('user');
  const storedToken = localStorage.getItem('token');
  const [user, setUser] = useState(storedUser ? JSON.parse(storedUser) : null);
  const [token, setToken] = useState(storedToken ? storedToken : null);

  //initialGroups holds all of the groups fetched from the Db
  const [initialGroups, setInitialGroups] = useState([]);
  //Holds all of our tags for filtering the groups 'genre'
  const [tag, setTag] = useState([]);
  //Holds current search state
  //Holds results filtered by search
  const [filteredResults, setFilteredResults] = useState([]);

  /* const onLogin = (user, token) => {
    setUser(user);
    setToken(token);
  }; */

  useEffect(() => {
    fetch('https://groups-api-6de9bfaff2b7.herokuapp.com/clubs')
      .then((res) => res.json())
      .then((data) => {
        const clubData = data.map((club) => {
          return {
            id: club._id,
            name: club.name,
            description: club.description,
            posts: club.posts,
            groupImg: club.groupImg,
            members: club.members,
            tags: club.tags,
          };
        });

        const uniqueTags = Array.from(
          new Set(clubData.flatMap((group) => group.tags))
        );

        setTag(uniqueTags);
        setInitialGroups(clubData);
        setFilteredResults(clubData);
      });
  }, []);

  //Handles all filter results
  const queryHandler = (arg) => {
    if (arg === 'All') {
      setFilteredResults(initialGroups);
    } else {
      let current = initialGroups.filter((group) => group.tags.includes(arg));
      setFilteredResults(current);
    }
  };

  const syncUser = (user) => {
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const refreshGroupsAfterDelete = (name) => {
    let newGroups = initialGroups.filter((group) => group.name !== name);
    setInitialGroups(newGroups);
  };

  return (
    <BrowserRouter>
      {user && token ? <Navigation /> : null}
      <Row className='justify-content-md-center' style={{ marginTop: '5%' }}>
        <Routes>
          <Route
            path='/'
            element={
              <>
                {!user || !token ? (
                  <Navigate to='/login' replace />
                ) : initialGroups.length === 0 ? (
                  <h1>Loading.....</h1>
                ) : (
                  <>
                    <Col style={{ marginTop: 80 }} className='hide-left-side'>
                      <div className='left-side-filter'>
                        <button
                          key='allkey'
                          onClick={() => queryHandler('All')}
                          className='filterButton'
                        >
                          All
                        </button>
                        {tag.length > 0 && tag.length <= 5 ? (
                          tag.map((t) => (
                            <button
                              key={t}
                              onClick={() => queryHandler(t)}
                              className='filterButton'
                            >
                              {t}
                            </button>
                          ))
                        ) : tag.length > 5 ? (
                          tag.slice(0, 6).map((t) => (
                            <button
                              key={t}
                              onClick={() => queryHandler(t)}
                              className='filterButton'
                            >
                              {t}
                            </button>
                          ))
                        ) : (
                          <h1>Loading.....</h1>
                        )}
                      </div>
                    </Col>
                    <Col className='centerpiece-component'>
                      <div className='dropdown-menu-mobile'>
                        <Dropdown>
                          <Dropdown.Toggle variant='light' id='dropdown-basic'>
                            Filter
                          </Dropdown.Toggle>

                          <Dropdown.Menu>
                            {tag.length > 0 ? (
                              tag.map((t) => (
                                <Dropdown.Item
                                  key={t}
                                  onClick={() => queryHandler(t)}
                                >
                                  {t}
                                </Dropdown.Item>
                              ))
                            ) : (
                              <h1>Loading.....</h1>
                            )}
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                      <div className='scroll-div'>
                        <h1 className='white-text-header'>Explore</h1>
                        <p className='white-text'>
                          See groups, and a preview of what they're talking
                          about
                        </p>
                        {filteredResults.map((item) => (
                          <div key={item.name}>
                            <Link
                              to={`/groups/${item.name}`}
                              className='removeDecoration'
                            >
                              <Card
                                style={{
                                  marginTop: 7,
                                  borderBottomLeftRadius: 0,
                                  borderBottomRightRadius: 0,
                                  zIndex: 2,
                                }}
                                className='main-view-card'
                              >
                                <div className='suggestionsWithImg'>
                                  <img
                                    src={item.groupImg}
                                    alt='group logo'
                                    className='profilePic'
                                  ></img>
                                  <div style={{ width: '60%' }}>
                                    <Card.Title>{item.name}</Card.Title>
                                    <Card.Subtitle>
                                      {item.description}
                                    </Card.Subtitle>
                                  </div>
                                </div>
                              </Card>
                            </Link>
                            <div className='preview-post'>
                              {item.posts.length > 0 ? (
                                <>
                                  <p className='example-post-author'>
                                    {item.posts[0].postUser}
                                  </p>
                                  <p className='example-post-date'>
                                    {JSON.parse(item.posts[0].date)}
                                  </p>
                                  <p className='example-post'>
                                    {item.posts[0].postBody}
                                  </p>
                                  <div>
                                    {item.posts[0].likes ? (
                                      <div className='current-likes-number-container'>
                                        <FontAwesomeIcon
                                          icon={faHeart}
                                          className='heart-button like-button-already-liked'
                                        />
                                        <p className='current-likes-on-post'>
                                          {item.posts[0].likes}
                                        </p>
                                      </div>
                                    ) : null}
                                  </div>
                                </>
                              ) : (
                                <p>No posts to preview</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </Col>
                    <Col className='recommended-right-side'>
                      <h1 className='white-text-header'>Recommended Groups</h1>
                      <Recommendation groups={initialGroups} />
                    </Col>
                  </>
                )}
              </>
            }
          />
          <Route
            path='/profile'
            element={
              <>
                {user && token ? (
                  <Profile
                    user={user}
                    onLogout={() => {
                      setUser(null);
                      setToken(null);
                      localStorage.clear();
                    }}
                    groupSuggestions={initialGroups}
                    syncUser={syncUser}
                  />
                ) : (
                  <Navigate to='/login' />
                )}
              </>
            }
          />
          <Route
            path='/login'
            element={
              <Login
                onLogin={(user, token) => {
                  setUser(user);
                  setToken(token);
                }}
              />
            }
          />
          <Route
            path='/register'
            element={
              <Registration
                onLogin={(user, token) => {
                  setUser(user);
                  setToken(token);
                }}
              />
            }
          />
          <Route
            path='/creategroup'
            element={
              <>
                {user && token ? (
                  <CreateGroup user={user} tags={tag} />
                ) : (
                  <Navigate to='/login' />
                )}
              </>
            }
          />
          <Route
            path='/mygroups'
            element={
              <>
                {user && token ? (
                  <GroupList
                    user={user}
                    groups={initialGroups}
                    tags={tag}
                    refreshGroupsAfterDelete={refreshGroupsAfterDelete}
                  />
                ) : (
                  <Navigate to='/login' />
                )}
              </>
            }
          />
          <Route
            path='/groups/:groupname'
            element={
              <>
                {user && token ? (
                  <ClubPreview user={user} />
                ) : (
                  <Navigate to='/login' />
                )}
              </>
            }
          />
          <Route
            path='/groups/:groupname/member'
            element={
              <>
                {user && token ? (
                  <MemberView user={user} />
                ) : (
                  <Navigate to='/login' />
                )}
              </>
            }
          />
        </Routes>
      </Row>
    </BrowserRouter>
  );
};
