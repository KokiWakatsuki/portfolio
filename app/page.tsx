import { About } from "./components/About/About";
import { Activity } from "./components/Activity/Activity";
import { Card } from "./components/Card/Card";
import { Contact } from "./components/Contact/Contact";
import { Footer } from "./components/Footer/Footer";
import { Header } from "./components/Header/Header";
import { Skill } from "./components/Skill/Skill";
import { Work } from "./components/Work/Work";
import SolarSystem from "./components/SolarSystem/SolarSystem";

export default function Home() {
    return (
        <div className='flex flex-col gap-40 justify-center items-center'>
            <SolarSystem />
            <Header />
            <div id="about">
                <Card title='About'>
                    <About />
                </Card>
            </div>
            <div id="work">
                <Card title='Work'>
                    <Work />
                </Card>
            </div>
            <div id="skill">
                <Card title='Skill'>
                    <Skill />
                </Card>
            </div>
            <div id="activity">
                <Card title='Activity'>
                    <Activity />
                </Card>
            </div>
            <div id="contact">
                <Card title='Contact'>
                    <Contact />
                </Card>
            </div>
            <Footer />
        </div>
    );
}
