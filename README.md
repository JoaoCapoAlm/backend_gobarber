# Funcionalidades

## Recuperação de senha

 **RF** <!-- Requisitos Funcionais -->
 - O usuário deve recuperar sua senha informando o seu e-mail;
 - O usuário deve receber um e-mail com as instruções de recuperação de senha;
 - O usuário deve poder resetar sua senha;

 **RNF** <!-- Requisitos Não Funcionais -->
 - Utilizar Mailtrap para testar envios em ambiente de desenvolvimento;
 - Utilizar Amazon SES para envios em produção;
 - O envio de e-mails deve acontecer em segundo plano (background job);

 **RN** <!-- Regras de Negócio -->
 - O link enviado por e-mail para resetar a senha, deve expirar em 2h;
 - O usuário precisa confirmar a nova senha ao reseta-la;

## Atualização do perfil
**RF**
- O usuário deve atualizar seu nome, e-mail, senha e avatar;

**RN**
- O usuário não pode alterar seu e-mail para um e-mail já utilizado por outro usuário;
- Para atualizar sua senha, o usuário deve informar a sua senha antiga;
= Para atualizar sua senha, o usuário deve confirmar sua senha;

## Agendamento de serviço
**RF**
- O usuário deve poder listar todos os prestadores de serviço cadastrados;
- O usuário deve poder listar os dias de um mês com pelo menos um horário disponível de um prestador;
- O usuário deve listar horários disponíveis em um dia específico de um prestador;
- O usuário deve poder realizar um novo agendamento com um prestador;

**RNF**
- A listagem de prestadores deve ser armazenado em cache;

**RN**
- Cada agendamento deve durar 1h exatamente;
- Os agendamentos devem estar disponíveis entre 8h as 18h (Primeiro às 8h, último as 17h);
- O usuário não pode agendar um usuário já ocupado;
- O usuário não pode agendar em um horário que já passou;
- O usuário não pode agendar serviços com sigo mesmo;


## Painel do prestador
**RF**
- O usuário deve poder listar seus agendamentos de um dia específico;
- O prestador deve receber uma notificação sempre que houver um novo agendamento;
- O prestador deve poder visualizar as notificações não lidas;

**RNF**
- Os agendamentos do prestador no dia devem ser armazenados em cache;
- As notificações do prestador devem ser armazenadas no MongoDB;
- As notificações do prestador devem ser enviadas em tempo real utilizando o Soket.io;
-

**RN**
- A notificação deve ter m estado de lida ou não lida para que o prestador possa controlar;
