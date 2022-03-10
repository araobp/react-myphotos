import React, { FC } from "react";
import './switch.css';

// [Reference] https://www.w3schools.com/howto/howto_css_switch.asp

export type SwitchProps = {
    isChecked: boolean,
    label: string,
    onChange: (isChecked: boolean) => void;
}

export const Switch: FC<SwitchProps> = ({ isChecked, label, onChange }) => {
    return (
        <div style={{ display: "flex", alignItems: "center", marginTop: "8px" }}>{label}&nbsp;
            <label className="switch">
                <input type="checkbox" checked={isChecked} onChange={e => onChange(e.target.checked)} />
                <span className="slider round"></span>
            </label>
        </div>
    );
}