import { Button } from "primereact/button";
import './VoteSelect.css'; // Ensure the correct path to the CSS file

const VoteSelect = ({ setVote }) => {
    const voteValues = [1, 2, 3, 5, 8, 13, 21];

    return (
        <div className="vote-select-container">
            {voteValues.map((voteValue) => (
                <Button
                    key={voteValue}
                    label={voteValue.toString()}
                    onClick={() => setVote(voteValue)}
                    className="vote-select-button" // Add the class here
                    raised
                    rounded
                />
            ))}
        </div>
    );
}

export default VoteSelect;
