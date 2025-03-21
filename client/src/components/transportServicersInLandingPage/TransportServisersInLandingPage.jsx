import React, { useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import { ClientContext } from '../../context/ClientContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { useNavigate } from 'react-router-dom';
import TransportationCard from './TransportServiceCard';

const TransportServisersInLandingPage = () => {
    const navigator = useNavigate();

    const { allTransportServices } = useContext(ClientContext);
    return (



        <div >
            <Container style={{ padding: '2rem' }}>
                <Row>
                    <Col>
                        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                            Transport Servicers
                        </h2>
                    </Col>
                </Row>

                <Swiper
                    spaceBetween={30}
                    slidesPerView={3}
                    modules={[Autoplay, Pagination]}
                    loop={true}
                    autoplay={{ delay: 3000 }}
                    // pagination={{ clickable: true }}
                    style={{ paddingBottom: '2rem' }}
                >
                    {allTransportServices.map((transport) => (
                        <SwiperSlide key={transport.id}>
                            <div>
<TransportationCard service={transport} />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>


                <button className="view-all-button view-btn  " onClick={() => { navigator("/allhotels") }}>Book a Hotel</button>

            </Container>
        </div>
    );
}

export default TransportServisersInLandingPage