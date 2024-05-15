import React, { useState } from 'react';
import { Form, Row, Col, Stack, Image, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import axios from 'axios';

import { API_SERVER } from '../config';

import { IoIosSearch } from "react-icons/io";
import { VscSearchStop } from "react-icons/vsc";
import { RxCross2 } from "react-icons/rx";
import { RiHeartAddLine } from "react-icons/ri";
import { FaHeartBroken } from "react-icons/fa";
import { BsFillPersonDashFill } from "react-icons/bs";
import { BsPersonAdd } from "react-icons/bs";
import imagePlaceholder from '../assets/icons/image-placeholder.svg';

function HeaderSearch() {
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState([]);
    const [searchFocused, setSearchFocused] = useState(false);
    const [isInvalid, setIsInvalid] = useState(false);

    const validateQuery = (query) => {
        if (query === '') {
            setResults([]);
            setSearchQuery('');
            return false;
        }

        if (query.match(/^[a-zA-Z0-9\s]*$/)) {
            setSearchQuery(query);
            setIsInvalid(false);
            return true;
        }

        setIsInvalid(false);
        return false;
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter' && validateQuery && searchQuery !== '') {
            searchUsers(searchQuery.toLowerCase());
        } else if (e.key === 'Escape') {
            setSearchQuery('');
            setResults([]);
        }
    };

    const searchUsers = (query) => {
        axios.get(`${API_SERVER}/users/search?q=${query}`, { withCredentials: true })
            .then((res) => {
                setResults(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const handleUserRelationshipChange = (nickname, action) => {
        const user = {
            nickname: nickname,
            action: action
        };
        axios.post(`${API_SERVER}/users/relationships`, user, { withCredentials: true })
            .then((res) => {
                setResults(results.map(person => {
                    if (person.nickname === nickname) {
                        return res.data;
                    }
                    return person;
                }));
            })
            .catch((err) => {
                console.error(err);
            });
    };

    return (
        <div className='search-block h-100'>
            <Row className="search-block__header m-0">
                <h2 className='mb-3 mt-4 p-0'>Search</h2>
                <div className="search-block__input-container p-0 ps-1">
                    {!searchFocused && searchQuery.length === 0 && (
                        <IoIosSearch size={14} className='search-block__icon' />
                    )}
                    <Form.Control
                        type="text"
                        placeholder="Search"
                        value={searchQuery}
                        className={`search-block__input ${searchFocused || searchQuery.length > 0 ? 'ps-2' : 'ps-4'}`}
                        isInvalid={isInvalid}
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setSearchFocused(false)}
                        onChange={(e) => validateQuery(e.target.value)}
                        onKeyDown={handleSearch}
                    />
                    <Form.Text className="text-muted mt-0">
                        Press Enter to search
                    </Form.Text>
                    {searchQuery.length > 0 && (
                        <RxCross2
                            size={14}
                            className='search-block__clear'
                            onClick={() => {
                                setSearchQuery('');
                                setResults([]);
                            }}
                        />
                    )}
                </div>
            </Row>
            {results.length > 0 ? (
                <Stack className='search-block__results border-1'>
                    {results.map(person => {
                        return (
                            <Row className='search-block__result py-2 px-3' key={person.nickname}>
                                <Col className='d-flex align-items-center col-1'>
                                    <Image src={person.avatar || imagePlaceholder} roundedCircle />
                                </Col>
                                <Col className='col-2'>
                                    <p>{person.firstName} {person.lastName}</p>
                                    <p>@{person.nickname}</p>
                                </Col>
                                <Col className='col-3'>
                                    {/*
                                    * Add the following icons to the right side of the user's name:
                                    * - RiHeartAddLine (Follow)
                                    * - FaHeartBroken (Unfollow)
                                    * - BsFillPersonDashFill (Unfriend)
                                    * - BsPersonAdd (Add friend)
                                    */}
                                    {person.relationship === 'friend' ? (
                                        <OverlayTrigger
                                            placement="bottom"
                                            overlay={<Tooltip id="tooltip-unfriend">Unfriend</Tooltip>}
                                        >
                                            <Button variant='none' onClick={() => handleUserRelationshipChange(person.nickname, 'unfriend')}>
                                                <BsFillPersonDashFill size={20} />
                                            </Button>
                                        </OverlayTrigger>
                                    ) : person.relationship === 'follower' ? (
                                        <OverlayTrigger
                                            placement="bottom"
                                            overlay={<Tooltip id="tooltip-add-1">Accept friend request</Tooltip>}
                                        >
                                            <Button variant='none' onClick={() => handleUserRelationshipChange(person.nickname, 'add_friend')}>
                                                <BsPersonAdd size={20} />
                                            </Button>
                                        </OverlayTrigger>
                                    ) : person.relationship === 'following' ? (
                                        <OverlayTrigger
                                            placement="bottom"
                                            overlay={<Tooltip id="tooltip-unfollow">Cancel friend request</Tooltip>}
                                        >
                                            <Button variant='none' onClick={() => handleUserRelationshipChange(person.nickname, 'unfollow')}>
                                                <FaHeartBroken size={18} />
                                            </Button>
                                        </OverlayTrigger>
                                    ) : person.relationship === 'none' && person.autoFollow ? (
                                        <OverlayTrigger
                                            placement="bottom"
                                            overlay={<Tooltip id="tooltip-follow">Follow</Tooltip>}
                                        >
                                            <Button variant='none' onClick={() => handleUserRelationshipChange(person.nickname, 'follow')}>
                                                <RiHeartAddLine size={20} />
                                            </Button>
                                        </OverlayTrigger>
                                    ) : (
                                        <OverlayTrigger
                                            placement="bottom"
                                            overlay={<Tooltip id="tooltip-add-2">Add friend</Tooltip>}
                                        >
                                            <Button variant='none' onClick={() => handleUserRelationshipChange(person.nickname, 'add_friend')}>
                                                <BsPersonAdd size={20} />
                                            </Button>
                                        </OverlayTrigger>
                                    )}
                                </Col>
                            </Row>
                        );
                    })}
                </Stack>
            ) : (
                <Row className='search-block__no-result align-items-center w-100 flex-column'>
                    <Col className='d-flex align-items-center justify-content-center flex-column'>
                        <VscSearchStop size={85} />
                        <p>No results <br /> found</p>
                    </Col>
                </Row>
            )}
        </div>
    )
}

export default HeaderSearch