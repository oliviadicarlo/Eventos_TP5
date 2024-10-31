export default class ValidationsHelper{
    isANumber = (test) => {
        return !isNaN(test);
    }

    fullLetters(s) {
        const regex = /^[a-zA-Z\s]+$/;;
        return regex.test(s);
    }

    longerThan(number, text){
        return text.length >= number;
    }

    latitudeLongitude(la, lo) {
        const latRegex = /^-?([1-8]?\d(\.\d{1,15})?|90(\.0{1,15})?)$/;
        const lonRegex = /^-?((1[0-7]|[1-9])?\d(\.\d{1,15})?|180(\.0{1,15})?)$/;        
        return latRegex.test(la) && lonRegex.test(lo); 
    }

    validEmail(text){
        var pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return pattern.test(text);
    }

}