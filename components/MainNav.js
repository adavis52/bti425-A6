import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import { removeToken } from '@/lib/authenticate';
import { readToken } from '@/lib/authenticate';
import { addToHistory } from '@/lib/userData';
import { searchHistoryAtom } from '@/store';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import { useRouter } from 'next/router';
import Nav from 'react-bootstrap/Nav';
import { useState } from 'react';
import { useAtom } from 'jotai';
import Link from 'next/link';

export default function MainNav() {
    let token = readToken();
    const router = useRouter();
    const [term, setTerm] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);
    const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);

    async function formSubmit(event) {
        event.preventDefault();
        setIsExpanded(false);

        const queryString = `/artwork?title=true&q=${term}`;

        setSearchHistory(await addToHistory(`title=true&q=${term}`));

        router.push(queryString);
    }

    function logout() {
        setIsExpanded(false);
        removeToken();
        router.push('/login');
    }

    return (
        <>
            <Navbar collapseOnSelect expand={isExpanded ? 'xl' : 'lg'} className="fixed-top bg-primary navbar-dark">
                <Container>
                    <Navbar.Brand>Adam Davis</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setIsExpanded(!isExpanded)} />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Link legacyBehavior passHref href="/" onClick={() => setIsExpanded(false)}>
                                <Nav.Link active={router.pathname === "/"}>Home</Nav.Link>
                            </Link>
                            {
                                token &&
                                <Link legacyBehavior passHref href="/search" onClick={() => setIsExpanded(false)}>
                                    <Nav.Link active={router.pathname === "/search"}>Advanced Search</Nav.Link>
                                </Link>
                            }
                        </Nav>
                        { !token &&
                        <Nav className="me-auto">
                            <Link legacyBehavior passHref href="/register" onClick={() => setIsExpanded(false)}>
                                <Nav.Link active={router.pathname === "/register"}>Register</Nav.Link>
                            </Link>
                            <Link legacyBehavior passHref href="/login" onClick={() => setIsExpanded(false)}>
                                <Nav.Link active={router.pathname === "/login"}>Login</Nav.Link>
                            </Link>
                        </Nav>
                        }
                        &nbsp;
                        {
                            token &&
                            <Form className="d-flex" onSubmit={formSubmit}>
                                <Form.Control
                                    type="search"
                                    placeholder="Search"
                                    className="me-2"
                                    aria-label="Search"
                                    onChange={(event) => setTerm(event.target.value)}
                                />
                                <Button type="submit" variant="success">Search</Button>
                            </Form>
                        }
                        &nbsp;
                        <Nav>
                            <NavDropdown title="Username" id="basic-nav-dropdown">
                                <Link legacyBehavior passHref href="/favourites" onClick={() => setIsExpanded(false)}>
                                    <NavDropdown.Item active={router.pathname === "/favourites"}>Favourites</NavDropdown.Item>
                                </Link>
                                <Link legacyBehavior passHref href="/history" onClick={() => setIsExpanded(false)}>
                                    <NavDropdown.Item active={router.pathname === "/history"}>History</NavDropdown.Item>
                                </Link>
                                {
                                    token && <NavDropdown.Item active={router.pathname === "/logout"} onClick={() => logout()}>Logout</NavDropdown.Item>
                                }
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <br></br>
            <br></br>
        </>
    );
}