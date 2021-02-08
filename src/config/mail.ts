interface IMailConfig {
  driver: 'ethereal' | 'sendgrid';
  defaults: {
    from: {
      email: string;
    };
  };
}

export default {
  driver: process.env.MAIL_DRIVER || 'ethereal',

  defaults: {
    from: {
      email: 'devhelloword@gmail.com',
    },
  },
} as IMailConfig;
