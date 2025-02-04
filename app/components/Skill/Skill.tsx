import {
    siGithub,
    siDocker,
    siNextdotjs,
    siReact,
    siVuedotjs,
    siHtml5,
    siCss3,
    siFlutter,
    siTypescript,
    siJavascript,
    siLaravel,
    siRubyonrails,
    siPython,
    siC,
    siPostgresql,
    siMysql,
    siGit,
    siPostman,
    siCloudflare,
    siProxmox,
    siSlack,
    siFigma
  } from 'simple-icons';

export const Skill = () => {
    const front_icons = [
        siNextdotjs,
        siReact,
        siVuedotjs,
        siHtml5,
        siCss3,
        siFlutter,
        siTypescript,
        siJavascript,
      ];
    const back_icons = [
        siLaravel,
        siRubyonrails,
        siPython,
        siC,
    ];
    const db_icons = [
        siPostgresql,
        siMysql,
    ];
    const other_icons = [
        siGithub,
        siDocker,
        siGit,
        siPostman,
        siCloudflare,
        siProxmox,
        siSlack,
        siFigma
    ];

    return (
        <div>
            <div>Frontend</div>
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
            <div>Backend</div>
            <div className='flex flex-row'>
            {back_icons.map((icon, index) => (
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
            <div>DB</div>
            <div className='flex flex-row'>
            {db_icons.map((icon, index) => (
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
            <div>その他</div>
            <div className='flex flex-row'>
            {other_icons.map((icon, index) => (
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
    )
}