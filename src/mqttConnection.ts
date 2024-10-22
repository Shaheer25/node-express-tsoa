// Copyright (C) 2021 LogicHive Solutions Pvt Ltd
// All Rights Reserved
import mqtt from 'mqtt';
import { EClientType } from './interface/interface';
import ClientModel from './model/Client_Type';
import SettingsModel from './model/settings';
import { generate_epoch_time, get_host_ip } from './utils/common';
import jwt from 'jsonwebtoken';

// Making connection with broker

const host = process.env.MQTT_HOST || 'broker.mqttdashboard.com';
const port = process.env.MQTT_PORT || 8000;
const connectUrl = `ws://${host}:${port}/mqtt`;
const jwtSecretKey = process.env.JWT_SECRET_KEY;

let client: any;

async function getClient() {
	// const unlock = await redis_lock('lock:client_type');
	let client_type_id = await SettingsModel.findOne({ collection_name: 'client_type' });
	if (client_type_id === null) {
		await new SettingsModel({
			collection_name: 'client_type',
			max_counter: 1,
		}).save();
		client_type_id = await SettingsModel.findOne({ collection_name: 'client_type' });
	}
	const clientId = client_type_id['max_counter'];

	await SettingsModel.updateOne(
		{ collection_name: 'client_type' },
		{
			$inc: {
				max_counter: 1,
			},
		},
	);
	// await unlock();
	const data_ = {
		expiry: generate_epoch_time(120),
	};

	// JWT Token Creation

	const username = jwt.sign(data_, jwtSecretKey);
	const source_ip = await get_host_ip();
	const data = new ClientModel({
		clientType: EClientType.EVENT_MANAGEMENT,
		userData: {},
		clientId,
		password: '1000',
		url: 'broker.mqttdashboard.com',
		username: username,
		source_ip,
		allowedSubscriptions: [
			'event_management',
		],
	});

	await data.save();

	client = mqtt.connect(connectUrl, {
		clientId: String(clientId),
		username,
		password: '1000',
		clean: true,
		connectTimeout: 4000,
		reconnectPeriod: 1000,
	});

	await client.on('connect', () => {
		client.subscribe('event_management', function (err) {
			if (!err) {
				console.log('Connection successful and subscribe event_management topic'); //eslint-disable-line
			} else {
				console.log(err) //eslint-disable-line
			}
		});
	});
}


function publish(topic: string, msg: string): void {
	client.publish(topic, msg.trim());
	// console.log(topic, JSON.parse(msg));
}


const mqttService = {
	getClient,
	publish,
};


export default mqttService;
