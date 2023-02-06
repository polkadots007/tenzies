
export default function Dice(props) {
    return (
        <div 
            className={`dice ${props.frozenStatus && 'frozen-die'}`}
            onClick={props.freezeDice}
        >
            {props.value}
        </div>
    );
}