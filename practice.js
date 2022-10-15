function sum(n){
    let total = 0
    for(let i = 1;i<=n;i++){
        total +=i
    }
    return total
}

console.log(sum(3))

function sumOfNumbers(array){
    let total = 0
    for (let i of array) {
        total += i;
    }
    return total
}

console.log(sumOfNumbers([5,2,8]))

function getEvenNumbers(array){
    let even = []
    for (let i of array) {
        if(i%2==0){
            even.push(i)
        }
    }
    return even
}

console.log(getEvenNumbers([4,7,3,6]))


function count(){
    if(!count.count){
        count.count = 0
    }
    count.count ++
    return count.count
}

console.log(count())
console.log(count())
console.log(count())

function makeGetThree(){
    return function(){
        return 3
    }
}

const getThree = makeGetThree()
const three = getThree()

console.log(three)

function makeCount(){
    return function count(){
        if(!count.count){
            count.count = 0
        }
        count.count ++
        return count.count
    }
}

console.log("lalala")
const firstCount = makeCount()
console.log(firstCount())
console.log(firstCount())
const secondCount = makeCount()
console.log(secondCount())
console.log(secondCount())
console.log(secondCount())
console.log(secondCount())
console.log(firstCount())

const humans = [
    {
        name:"lala",
        age:10
    },
    {
        name:"laba",
        age:15
    },
    {
        name:"laka",
        age:18
    }
]
function containAdults(humans){
	for (const human of humans){
		if (human.age >=18){
            return true
        }
    }
    return false
}

console.log(containAdults(humans))