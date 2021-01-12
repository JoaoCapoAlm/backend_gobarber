import express from 'express';
import 'reflect-metadata';
import uploadConfig from './config/uploads';
import './database';
import routes from './routes';



const app = express();

app.use(express.json());
app.use('/files', express.static(uploadConfig.directory));
app.use(routes);

app.listen(3333, () => {
  // eslint-disable-next-line no-console
  console.log('==> Servidor ativo na porta: 3333');
});
