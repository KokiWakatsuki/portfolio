import {
    siGithub,
    siGmail,
    siInstagram,
    siX,
  } from 'simple-icons';

export const Contact = () => {
    const front_icons = [
        siGithub,
        siGmail,
        siInstagram,
        siX,
      ];
    return (
        <div>
            <h1>Contact</h1>
            <div className='flex flex-row'>
                {front_icons.map((icon, index) => (
                    <div
                        key={index}
                        style={{
                            width: '50px',
                            height: '50px',
                            fill: 'white'  // ここで色を指定
                        }}
                        dangerouslySetInnerHTML={{ __html: icon.svg }}
                        className='m-1'
                    />
                ))}
            </div>
        </div>
    );
}