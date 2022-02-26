import { FC } from 'react';
import '../App.css';

export const AboutPage: FC<{}> = _ => {
    return (
        <div className='default'>
            <div>
                <br></br>
                <div><a className="menu-text" href="https://github.com/araobp">Author</a></div>
                <br></br>
                <div><a className="menu-text" href="https://github.com/araobp/react-myphotos">Projet page</a></div>
            </div>
        </div>
    );
}