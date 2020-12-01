import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ListCols from '../ListCols/ListCols';
import { Row, Col, Button, Input, Table, Typography } from 'antd';
import './Calc.scss';
import Background from '../../assets/image/calc-image/PromoBg.png';
import { PlusCircleFilled, DownOutlined, UpOutlined } from '@ant-design/icons';

import { v1 as uuid } from 'uuid';
import { addEarly } from '../../redux/actions';

const { Text } = Typography;

const columns = [
    {
        title: '№',
        dataIndex: 'number',
        width: 60,

    },
    {
        title: 'Дата платежа',
        dataIndex: 'paymentDate',
        align: 'center'
    },
    {
        title: 'Задолженность',
        dataIndex: 'debt',
        align: 'center'
    },
    {
        title: 'Погашение процентов',
        dataIndex: 'interestRepayment',
        align: 'center'
    },
    {
        title: 'Погашение основного долга',
        dataIndex: 'principalDebt',
        align: 'center'
    },

    {
        title: 'Сумма платежа',
        dataIndex: 'payment',
        align: 'center'
    }
];

function Calc() {

    const earlyPayment = useSelector(state => state.earlyPayment);
    const dispatch = useDispatch();

    const [SP, setValue] = useState(500000);    //Стоимость недвижимости
    const [fee, setFee] = useState(0);          //Первоначальный взнос
    const [t, setT] = useState(1);              //Срок кредита
    const [r, setR] = useState(1);              //Процентная ставка

    const [visible, setVisible] = useState(false); // График платежей

    const S = SP - fee;                  //Кредит
    const formula = ((1 - (Math.pow(1 + r / 1200, -(t * 12)))) / (r / 1200));
    const payment = S / formula;        //Ваш ежемесячный платеж

    const percentCredit = Math.floor(payment * t * 12);  //Проценты + Кредит
    const income = Math.round((payment / 60) * 100);     //Необходимый доход


    const date2 = new Date();
    date2.setMonth(date2.getMonth() + 1);
    let dateAdd = date2;

    const date1 = new Date();          //Дата платежа
    date1.setDate(1);

    let once3month = 3;
    let once6month = 6;
    let once12month = 12;

    let sumMonth = 0;
    let sumPayment = 0;
    let early = 0;

    let debtV = S;                    //Задолженность
    let interestRepayment;            //Погашение процентов
    let principalDebt = (payment - interestRepayment);  //Погашение основного долга
    const data = [];

    for (let i = 1; i <= t * 12; i++) {

        early = 0;
        // early
        for (let j = 0; j < earlyPayment.length; j++) {
            let date6 = new Date(earlyPayment[j].dateCalendar);

            let daysLag = Math.ceil((date1.getTime() - date6.getTime()) / (1000 * 3600 * 24) + 30);  //Разница между двумя датами

            if (earlyPayment[j].howMany === 'once' && date6.getMonth() === date1.getMonth() && date6.getFullYear() === date1.getFullYear()) {
                early = early + parseFloat(earlyPayment[j].summa);
            }

            if (earlyPayment[j].howMany === 'everyMonth' && daysLag > 0) {
                early = early + parseFloat(earlyPayment[j].summa);
            }

            if (earlyPayment[j].howMany === 'once3month' && daysLag > 0) {
                if (once3month % 3 === 0) {
                    early = early + parseFloat(earlyPayment[j].summa);
                }
                once3month++;
            }

            if (earlyPayment[j].howMany === 'once6month' && daysLag > 0) {
                if (once6month % 6 === 0) {
                    early = early + parseFloat(earlyPayment[j].summa);
                }
                once6month++;
            }

            if (earlyPayment[j].howMany === 'onceYear' && daysLag > 0) {
                if (once12month % 12 === 0) {
                    early = early + parseFloat(earlyPayment[j].summa);
                }
                once12month++;
            }
        }
        date1.setMonth(date1.getMonth() + 1);

        //Погашение процентов
        interestRepayment = (debtV * (1 + r / 1200) - debtV);

        //Погашение основного долга
        if (payment - interestRepayment + early > debtV) {
            principalDebt = debtV;
        } else {
            principalDebt = payment - interestRepayment + early;
        }

        //  Задолженность
        if (debtV * (1 + r / 1200) - principalDebt - interestRepayment < 0) {
            debtV = 0;
            early = 0;

        } else {
            debtV = (debtV * (1 + r / 1200) - principalDebt - interestRepayment);
        }

        if (principalDebt + interestRepayment == 0) {
            break;
        }
        sumMonth++;
        sumPayment = sumPayment + Math.ceil(principalDebt + interestRepayment);

        data.push({
            number: i,
            key: i,
            principalDebt: `${new Intl.NumberFormat('ru-RU').format((principalDebt.toFixed()))} ₽`,                  //Погашение основного долга
            interestRepayment: `${new Intl.NumberFormat('ru-RU').format((interestRepayment.toFixed()))} ₽`,          //Погашение процентов
            paymentDate: `${date1.format('dd.mm.yyyy')}`,                                                            //Дата платежа
            debt: `${new Intl.NumberFormat('ru-RU').format((debtV.toFixed()))} ₽`,                                   //Задолженность
            payment: `${new Intl.NumberFormat('ru-RU').format(((principalDebt + interestRepayment).toFixed()))} ₽`   //Сумма платежа
        });
    }

    let hh = (sumPayment) - Math.ceil(payment) * t * 12;
    let srok = t * 12 - sumMonth
    //   table end

    return (
        <Row className='calc'>
            <Col span={24} className='calc-titles'>
                <h1>Ипотечный калькулятор</h1>
                <p>Оцените свои возможности перед тем, как брать ипотечный кредит</p>
            </Col>

            <Col span={16}>
                <Row style={{ backgroundColor: 'rgba(21, 34, 66, 0.06)', borderRadius: '4px', padding: '20px 24px 20px 8px' }}>
                    <Col span={12} style={{ padding: '10px' }}>

                        <div className='input-group'>
                            <p>Стоимость недвижимости</p>
                            <Input
                                className='bottom-input'
                                type='number'
                                suffix='₽'
                                value={SP}
                                min="500000" max="99999999"
                                onChange={(e) => setValue(e.target.value)}
                            />

                            <input
                                type='range'
                                className='top-input e-range'
                                value={SP}
                                min="500000" max="99999999" step={10000}
                                onChange={(e) => setValue(e.target.value)}
                            />
                        </div>

                        <div className='input-group'>
                            <p>Первоначальный взнос</p>
                            <Input
                                className='bottom-input'
                                type='number'
                                suffix='₽'
                                value={fee}
                                min="0" max={SP - 500000}
                                onChange={(e) => setFee(e.target.value)}
                            />

                            <input
                                className='top-input'
                                type='range'
                                value={fee}
                                min="0" max={SP - 500000} step={SP > 99939000 ? 1 : 10000}
                                onChange={(e) => setFee(e.target.value)}
                            />
                        </div>
                        <div className='button-group'>
                            <Button onClick={() => setFee(0)}> 0% </Button>
                            <Button onClick={() => setFee(SP / 10)}>10%</Button>
                            <Button onClick={() => setFee(SP * 15 / 100)}>15%</Button>
                            <Button onClick={() => setFee(SP / 5)}>20%</Button>
                            <Button onClick={() => setFee(SP / 4)}>25%</Button>
                            <Button onClick={() => setFee(SP * 3 / 10)}>30%</Button>
                        </div>


                        <div className='input-group'>
                            <p>Срок кредита</p>
                            <Input
                                className='bottom-input'
                                type='number'
                                suffix='Лет'
                                value={t}
                                min="1" max="30" step="1"
                                onChange={(e) => setT(e.target.value)}
                            />
                            <input
                                className='top-input'
                                type='range'
                                value={t}
                                min="1" max="30" step="1"
                                onChange={(e) => setT(e.target.value)}
                            />
                        </div>

                        <div className='button-group'>
                            <Button onClick={() => setT(5)}>5 лет</Button>
                            <Button onClick={() => setT(10)}>10 лет</Button>
                            <Button onClick={() => setT(15)}>15 лет</Button>
                            <Button onClick={() => setT(20)}>20 лет</Button>
                        </div>


                        <div className='input-group'>
                            <p>Процентная ставка</p>
                            <Input
                                className='bottom-input'
                                type='number'
                                value={r}
                                suffix='%'
                                min="1" max="30" step="0.1"
                                onChange={(e) => setR(e.target.value)}
                            />
                            <input
                                className='top-input'
                                type='range'
                                value={r}
                                min="1" max="30" step="0.1"
                                onChange={(e) => setR(e.target.value)}
                            />
                        </div>
                        <div className='button-group'>
                            <Button onClick={() => setR(4.5)}>4.5%</Button>
                            <Button onClick={() => setR(6)}> 6% </Button>
                            <Button onClick={() => setR(7.5)}>7.5%</Button>
                            <Button onClick={() => setR(9.1)}>9.1%</Button>
                            <Button onClick={() => setR(10)}>10%</Button>
                        </div>
                    </Col>


                    <Col span={12} style={{ padding: '10px 10px 10px 30px', fontSize: '16px', lineHeight: '30px' }}>

                        <div>
                            <div style={{ textAlign: 'center', lineHeight: '30px' }}>
                                <Text style={{ fontSize: '16px', lineHeight: '22px' }}>Ваш ежемесячный платеж</Text>

                                <div style={{ fontSize: '30px', fontWeight: 'bold' }}>
                                    {new Intl.NumberFormat('ru-RU').format(parseFloat(payment.toFixed()))} ₽
                            </div>
                            </div>

                            <div className='right-blocks'>
                                <Text type="secondary">Кредит</Text>
                                <span>
                                    {new Intl.NumberFormat('ru-RU').format(S)} ₽
                                </span>
                            </div>

                            <div className='right-blocks'>
                                <Text type='secondary'>Проценты</Text>
                                <div>
                                    {new Intl.NumberFormat('ru-RU').format(percentCredit - S)} ₽
                                </div>
                            </div>

                            <div className='right-blocks'>
                                <div></div>
                                <div style={{ color: '#39C523', margin: '0' }}> {hh < -3 ? hh + ' ₽' : null}</div>
                            </div>

                            <div className='right-blocks'>
                                <Text type="secondary">Проценты + Кредит</Text>
                                <div>
                                    {new Intl.NumberFormat('ru-RU').format(percentCredit)} ₽
                                </div>
                            </div>
                            <div className='right-blocks'>
                                <div></div>
                                <div style={{ color: '#39C523', margin: '0' }}> {hh < -3 ? hh + ' ₽' : null}</div>
                            </div>

                            <div style={{ display: srok > 0 ? 'block' : 'none' }}>
                                <div className='right-blocks'>
                                    <Text type="secondary">Срок</Text>
                                    <div>
                                        {t * 12 - srok} месяцев
                                </div>
                                </div>
                                <div className='right-blocks'>
                                    <div></div>
                                    <div style={{ color: '#39C523', margin: '0' }}>- {srok} месяцев</div>
                                </div>
                            </div>




                            <div className='right-blocks'>
                                <Text type="secondary">Необходимый доход</Text>
                                <span>
                                    {new Intl.NumberFormat('ru-RU').format(income)} ₽
                                </span>
                            </div>

                            <div className='img-block' style={{ backgroundImage: `url(${Background})` }}>
                                <p className='img-block-title'>Ипотека</p>
                                <p className='img-block-content'>Ваши реальные <span style={{ display: 'block' }}>ипотечные ставки</span></p>
                                <Button type="primary" size='large'>Узнать онлайн</Button>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Col >

            <Col span={8} style={{ padding: '0 10px' }}>
                <div>
                    <div>
                        <ListCols t={t} />
                    </div>

                    <Button style={{ backgroundColor: 'rgba(21, 34, 66, 0.06)' }} className='plusButton' size='large' icon={<PlusCircleFilled />} block
                        onClick={() => {
                            if (earlyPayment.length) {
                                let date5 = new Date(earlyPayment[earlyPayment.length - 1].dateCalendar);
                                date5.setMonth(date5.getMonth() + 1);
                                dateAdd = date5;
                            }
                            dispatch(addEarly(
                                {
                                    id: uuid(),
                                    dateCalendar: dateAdd,
                                    howMany: 'once',
                                    summa: 10000,
                                    radio: 'time'
                                }
                            ))
                        }
                        }
                    >Рассчитать досрочное погашение</Button>
                </div>
            </Col>

            <Row>
                <Col span={24}>
                    <Button
                        size='large'
                        className='plusButton grafik'
                        onClick={() => setVisible(!visible)}
                        type="text">График платежей {visible ? <UpOutlined style={{ color: '#0468FF' }} /> : <DownOutlined style={{ color: '#0468FF' }} />} </Button>
                </Col>

                <Col span={24} style={visible ? { display: 'block' } : { display: 'none' }} >
                    <Table className='ant-table' columns={columns} dataSource={data} pagination={false} scroll={{ y: 600 }} />
                </Col>

                <Col span={24} style={{ height: '400px' }}>
                </Col>

            </Row>

        </Row >

    );

}

export default Calc;