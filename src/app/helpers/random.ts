export default function rnd(){
    return Object.freeze({
        generateRandomAlphanumericCode:generateRandomAlphanumericCode
    })

    function generateRandomAlphanumericCode(len:number){
        return [ ...Array(len) ].map(() => (~~(Math.random() * 36)).toString(36)).join('')
    }
}