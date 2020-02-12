import React, { useState, useEffect, useRef } from 'react';

const Test = (props)  => {
    const [disabled, disable] = useState(true);
    const [text, setText] = useState('');
    const textRef = useRef();
    
    const toggleDisabled = () => {
        disable(!disabled);
    };

    const showAlert = () => {
        alert(textRef.current.value);
    }

    useEffect(() => {
        console.log(text);
    }, [text]);

    useEffect(() => {
        console.log("난 딱한번실행되");
    }, []);

    return (
        <div>
            나 {props.name}다<br/>
            {disabled ? "나 꺼짐" : "나 켜짐"}<br/>
            <button type="button" onClick={toggleDisabled}>눌러봐라</button>
            <hr />
            <input type="text" ref={textRef} value={text} onChange={(e) => {setText(e.target.value)}}/>
            <button type="button" onClick={showAlert}>메세지창 띄우기</button>
        </div>
    );
}

// class Test extends React.Component {
//     constructor(props) {
//         super(props);
//         console.log("난초기화"); // props, state

//         this.state = {
//             disabled: true,
//             sdf: asdf,
//             asdf: sdf
//         };
//     }

//     componentDidMount() {
//         console.log('나 이제 로드끝남');

//         this.setState({
//             disabled: false,
//             sdf: sdf
//         });
//     }
    
//     render() {
//         const name = this.props.name;

//         return (
//             <div>
//                 내 이름은 {name}이야 <br />
//                 {this.state.disabled ? "나 꺼짐" : "나 켜짐"}
//             </div>
//         );
//     }
// }

export default Test;