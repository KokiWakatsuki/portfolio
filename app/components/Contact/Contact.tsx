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
            <div className='flex flex-row'>
                {front_icons.map((icon, index) => (
                    <div
                        key={index}
                        style={{
                            width: '50px',
                            height: '50px',
                            fill: '#E5E5CB'
                        }}
                        dangerouslySetInnerHTML={{ __html: icon.svg }}
                        className='m-1'
                    />
                ))}
            </div>
        </div>
    );
}