import React from 'react';
import './ListCols.scss';

import { DatePicker, Select, Radio, Input, Button, Card, Row, Col } from 'antd';
import { CloseCircleFilled } from '@ant-design/icons';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { deleteEarly, updateEarly } from '../../redux/actions';
const dateFormat = 'DD.MM.YYYY';

const { Option } = Select;

const options = [
    { label: 'Платеж', value: 'money' },
    { label: 'Срок', value: 'time' },
];

function ListCols(props) {

    let earlyPayment = useSelector(state => state.earlyPayment);
    const dispatch = useDispatch();

    const listItems = earlyPayment.map(item => {
        return <Card key={item.id}
            title={<b>Досрочный платеж</b>}
            size="small"
            style={{ backgroundColor: 'rgba(21, 34, 66, 0.06)', margin: '0 0 5px 0', borderRadius: '4px' }}
            extra={<Button className='closeButton' size='large' onClick={() => dispatch(deleteEarly(item.id))} icon={<CloseCircleFilled style={{ color: '#6D758A' }} />}>Удалить</Button>}
        >

            <Row gutter={[24, 16]}>
                <Col span={11} >
                    <span>Дата платежа</span>
                    <DatePicker defaultValue={moment(item.dateCalendar, dateFormat)}
                        size='large'
                        style={{ width: '155px' }}
                        format={dateFormat}
                        onChange={(date, dateString) => {
                            dispatch(updateEarly({
                                ...item,
                                dateCalendar: date
                            }))
                        }}
                    />
                </Col>
                <Col span={13} >
                    <span>Периодичность платежей</span>
                    <Select defaultValue="once"
                        size='large'
                        style={{ width: '100%' }}
                        onChange={(value) => {
                            dispatch(updateEarly({
                                ...item,
                                howMany: value
                            }))
                        }}
                    >
                        <Option value="once">Единовременно</Option>
                        <Option value="everyMonth">Ежемесячно</Option>
                        <Option value="once3month">Раз в 3 месяца</Option>
                        <Option value="once6month">Раз в 6 месяцев</Option>
                        <Option value="onceYear">Раз в 12 месяцев</Option>
                    </Select>
                </Col>
            </Row>
            <Row gutter={[24, 16]}>
                <Col span={11} >
                    <span>Что уменьшить?</span>
                    <Radio.Group
                        size='large'
                        style={{ lineHeight: '2px', width: '100%' }}
                        options={options}
                        defaultValue={item.radio}
                        optionType="button"
                        onChange={(e) => {
                            dispatch(updateEarly({
                                ...item,
                                radio: e.target.value
                            }))
                        }}
                    />
                </Col>
                <Col span={13} >
                    <span style={{ display: 'block' }}>Сумма</span>
                    <Input
                        size='large'
                        style={{ width: '100%' }}
                        value={item.summa}
                        suffix='₽'
                        type='number'
                        onChange={(e) => {
                            dispatch(updateEarly({
                                ...item,
                                summa: e.target.value
                            }))
                        }}
                    />
                </Col>
            </Row>
        </Card >
    })


    return <div>
        {listItems}
    </div>;
}

export default ListCols;