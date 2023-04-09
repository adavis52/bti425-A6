import MissingCard from '@/components/MissingCard';
import { removeFromHistory } from '@/lib/userData';
import ListGroup from 'react-bootstrap/ListGroup';
import styles from '@/styles/History.module.css';
import { searchHistoryAtom } from '@/store';
import Button from 'react-bootstrap/Button';
import { useRouter } from 'next/router';
import { useAtom } from 'jotai';

export default function History() {
    const router = useRouter();
    const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);

    const parsedHistory = [];

    function historyClicked(event, index) {
        router.push(`/artwork?searchHistory[${index}]`);
    }

    async function removeHistoryClicked(event, index) {
        event.stopPropagation();
        setSearchHistory(await removeFromHistory(searchHistory[index])); 
    }

    if(!searchHistory) return null;

    searchHistory.forEach(h => {
        let params = new URLSearchParams(h);
        let entries = params.entries();
        parsedHistory.push(Object.fromEntries(entries));
    });

    if (parsedHistory.length === 0) {
        return (
            <>
                <br />
                <br />
                <MissingCard title="Nothing Here" body="Try searching for some artwork"></MissingCard>
            </>
        );
    }

    return (
        <>
            <br />
            <br />
            <ListGroup>
                {parsedHistory.map((historyItem, index) => (
                    <ListGroup.Item key={index} className={styles.historyListItem} onClick={(event) => historyClicked(event, index)}>
                        {Object.keys(historyItem).map(key => (<>{key}: <strong>{historyItem[key]}</strong>&nbsp;</>))}
                        <Button className="float-end" variant="danger" size="sm" onClick={event => removeHistoryClicked(event, index)}>
                            &times;
                        </Button>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </>
    );
}