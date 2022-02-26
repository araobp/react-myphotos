import React, { FC } from "react";
import './switch.css';

// [Reference] https://www.w3schools.com/howto/howto_css_switch.asp

export type SwitchProps = {
    isChecked: boolean,
    onChange: (isChecked: boolean) => void;
}

export const Switch: FC<SwitchProps> = ({ isChecked, onChange }) => {
    return (
        <label className="switch">
            <input type="checkbox" checked={isChecked} onChange={e => onChange(e.target.checked)} />
            <span className="slider round"></span>
        </label>
    );
}