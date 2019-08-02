module.exports = {

  confirm: id => ({
    subject: 'The Last Dragon - Confirmation Email',
    html: `
      <a href='https://limitless-beach-12582.herokuapp.com/confirm/${id}'>
        click to confirm email
      </a>
    `,      
    text: `Copy and paste this link: https://limitless-beach-12582.herokuapp.com/confirm/${id}`
  })
  
}