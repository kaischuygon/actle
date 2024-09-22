import { BsX } from "react-icons/bs";
import Select, { ClearIndicatorProps, components } from "react-select";

export interface GuessOption {
    readonly value: string;  // Typically the movie ID or a unique identifier
    readonly label: string;  // The movie title
}

export interface GuessBoxProps {
    options: GuessOption[];
}

export default function GuessBox({ options }: GuessBoxProps) {
    // const [isDisabled, setIsDisabled] = useState(false);

    const ClearIndicator: React.FC<ClearIndicatorProps> = (props) => {
        return (
            <components.ClearIndicator {...props}>
                <BsX />
            </components.ClearIndicator>
        );
    };

    return (
        <Select
            className="w-full basic-single font-emoji"
            autoFocus={true}
            classNames={{
                control: (state) =>
                    state.isFocused ? '!border-primary' : '!border-base-300',

            }}
            classNamePrefix={'reactSelect'}
            placeholder="🍿 Guess a movie"
            isDisabled={false}
            isClearable={true}
            isSearchable={true}
            name="guess"
            options={options}
            theme={(theme) => ({
                ...theme,
                colors: {
                    ...theme.colors,
                    primary: 'oklch(var(--p))',
                    primary25: 'oklch(var(--b3))',
                    primary50: 'oklch(var(--b3))',
                    primary75: 'oklch(var(--b3))'
                },
            })}
            components={{ DropdownIndicator:() => null, ClearIndicator, IndicatorSeparator:() => null }}
        />
    )
}