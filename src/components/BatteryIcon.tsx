import '../css/battery.css';

type Props = {
    percent: number;
    isCharging: boolean;
};

// #00a6f9: blue
// #494a4d: black
// #f99f1c: orange

function BatteryIcon({ percent, isCharging }: Props) {
    const fillColor = percent <= 0.2 ? '#F44336' : percent >= 0.8 ? '#4CAF50' : '#f99f1c';
    return (
        <div className="battery relative w-[52px] h-[80px] border-[3px] border-[#00a6f9] rounded p-[2px]">
            <div className="flex items-end bg-[#494a4d] w-full h-full">
                <div style={{ backgroundColor: fillColor, width: '100%', height: `${percent * 100}%` }}></div>
            </div>
            {isCharging && (<div className='absolute top-0 left-0 flex justify-center items-center w-full h-full'><span className="material-symbols-rounded text-white">electric_bolt</span></div>)}
        </div>
    );
}

export { BatteryIcon };