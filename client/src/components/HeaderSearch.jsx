import React, { useState } from 'react';
import { Form, Row, Col, Stack, Image } from 'react-bootstrap';
import axios from 'axios';

import { API_SERVER } from '../config';
import RelationshipButton from './RelationshipButton';

import { IoIosSearch } from "react-icons/io";
import { VscSearchStop } from "react-icons/vsc";
import { RxCross2 } from "react-icons/rx";
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

        const regex = /^[a-zA-Zа-яА-ЯёЁ0-9\s]+$/;
        if (query.match(regex)) {
            setSearchQuery(query);
            setIsInvalid(false);
            return true;
        }

        setIsInvalid(true);
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
                                    <RelationshipButton user={person} results={results} setResults={setResults} />
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