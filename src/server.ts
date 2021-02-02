/* eslint-disable no-console */
import express from 'express';
import 'reflect-metadata';
import routes from './routes';
import './database';
import uploadConfig from './config/upload';

const app = express();

app.use(express.json());
app.use('/files', express.static(uploadConfig.directory));
app.use(routes);

app.listen(3333, () => {
  console.log('🛸 Server start on port 3333');
});
