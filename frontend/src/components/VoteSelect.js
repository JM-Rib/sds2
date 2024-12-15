import { Button } from 'primereact/button';

const VoteSelect = ({setVote}) => {


    const voteValues = [
        1,
        2,
        3,
        5,
        8,
        13,
        21 
    ]

    return (
        <>
            <div className="grid grid-cols-7 gap-9">
                {voteValues.map( (voteValue, i) => (
                    <Button label={voteValue} onClick={() => setVote(voteValue)} raised rounded />
                ))}
            </div>
        </>
    );
}

export default VoteSelect;
