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
        <main>
            <div className='fixed top-0 left-0 w-full h-full -z-10'>
                <SolarSystem />
            </div>
            <div className="fixed top-0 left-0 w-full z-50">
                <Header />
            </div>
            <div className='h-screen overflow-y-auto scroll-smooth'>
                <section className='min-h-screen flex items-center justify-center pt-24 pb-32 sm:pt-28 sm:pb-36 md:pt-32 md:pb-40'>
                    <div id="about">
                        <Card title='About'>
                            <About />
                        </Card>
                    </div>
                </section>
                <section className='min-h-screen flex items-center justify-center pt-24 pb-32 sm:pt-28 sm:pb-36 md:pt-32 md:pb-40'>
                    <div id="work">
                        <Card title='Work'>
                            <Work />
                        </Card>
                    </div>
                </section>
                <section className='min-h-screen flex items-center justify-center pt-24 pb-32 sm:pt-28 sm:pb-36 md:pt-32 md:pb-40'>
                    <div id="skill">
                        <Card title='Skill'>
                            <Skill />
                        </Card>
                    </div>
                </section>
                <section className='min-h-screen flex items-center justify-center pt-24 pb-32 sm:pt-28 sm:pb-36 md:pt-32 md:pb-40'>
                    <div id="activity">
                        <Card title='Activity'>
                            <Activity />
                        </Card>
                    </div>
                </section>
                <section className='min-h-screen flex items-center justify-center pt-24 pb-32 sm:pt-28 sm:pb-36 md:pt-32 md:pb-40'>
                    <div id="contact">
                        <Card title='Contact'>
                            <Contact />
                        </Card>
                    </div>
                </section>
            </div>
            <div className="fixed bottom-0 left-0 w-full z-50">
                <Footer />
            </div>
        </main>
    );
}
