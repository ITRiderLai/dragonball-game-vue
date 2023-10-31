export class Skill {
  constructor (params) {
      //己方人物
      this.selfChar = params.selfChar
      //地方人物
      this.enemyChar = params.enemyChar
      //己方人物列表
      this.selfList = params.selfList
      //敌方人物列表
      this.enemyList = params.enemyList
  }

  // 设置使用完技能的状态，避免重复使用技能
  setSkilledStatus (char) {
    char.isSkilled = true
  }

  // 设置沉默状态，无法使用技能
  setCharSilent (char) {
    char.isSilented = true
  }

  // 初始化
  init () {
    this.selfChar.isSkilled = false
    this.enemyChar.isSkilled = false
  }

  // 技能开始使用，返回此技能所消耗的时间
  start () {

    let selfInfo = {time: 1500, show: ''}
    let enemyInfo = {time: 1500, show: ''}
    //己方用技能
    !this.selfChar.isSkilled && !this.selfChar.isSilented && this.selfChar.skill[0] && (selfInfo = this.useSkill(this.selfChar.skill[0], this.selfChar, this.selfList, this.enemyChar))
    // 使用第二个技能时需要先判断是否已经使用第一个技能
    !this.selfChar.isSkilled && !this.selfChar.isSilented && this.selfChar.skill[1] && (selfInfo = this.useSkill(this.selfChar.skill[1], this.selfChar, this.selfList, this.enemyChar))

    //敌方用技能
    !this.enemyChar.isSkilled && !this.enemyChar.isSilented && this.enemyChar.skill[0] && (enemyInfo = this.useSkill(this.enemyChar.skill[0], this.enemyChar, this.enemyList, this.selfChar))

    !this.enemyChar.isSkilled && !this.enemyChar.isSilented && this.enemyChar.skill[1] && (enemyInfo = this.useSkill(this.enemyChar.skill[1], this.enemyChar, this.enemyList, this.selfChar))

    return {selfInfo, enemyInfo}
  }

  useSkill (skill, char, charList, enemy) {
    
    const that = this

    const skillName = {
      'repeat' () {
        return that.residualImageFist(skill, char, charList)
      },
      'self' () {
        return that.selfAddZl(skill, char, 1800)
      },
      'victory' () {
        return that.cure(skill, char)
      },
      'silent' () {
        return that.silent(skill, char, enemy)
      },
      'addAndReduce' () {
        return that.addSelfAndReduceEnemy(skill, char, enemy)
      },
      'groupAttack' () {
        return that.reduceZlGroup(skill, charList)
      }
     }

     return skillName[skill.type] && skillName[skill.type]() || {time: 1500, show: ''}
  }

  // 残像拳 (如果有一个重复的战士上场，增加34%的攻防值)
  residualImageFist (skill, char, charList) {

    let info = {time: 1500, show: ''}

    if (char.skillStatus) return

    const repeatChar = charList.filter(item => char.char_name === item.char_name)

    if(repeatChar.length > 1) {
      info = {time: 400, show: skill.show}
      this.setSkilledStatus(char)
      char.current_zl = char.current_zl * 4
      char.skillStatus = true
    }

    return info
  }

  // 治愈术（胜利后25%几率增加28%的攻击和防御值）
  cure (skill, char) {
    
    let info = {time: 1500, show: ''}

    if (
      char.winner
    ) {
      info = this.selfAddZl(skill, char, 1800)
    }

    return info
  }

  // 生命侵袭 (有50%的几率使对方沉默)
  silent (skill, char, enemy) {

    let info = {time: 1500, show: ''}

    if (Math.floor(Math.random() * 100) < skill.change) {
      info = {time: 1800, show: skill.show}
      this.setCharSilent(enemy)
      this.setSkilledStatus(char)
    }
    
    return info
  }

  // 有几率增加自己攻击值和减少敌方攻击值(闪光地狱弹)
  addSelfAndReduceEnemy (skill, char, enemy) {

    let info = {time: 1500, show: ''};
    if (Math.floor(Math.random() * 100) < skill.change) {
      info = {time: 1800, show: skill.show}
      this.setSkilledStatus(char)
      info.addZl = this.addZl(skill, char)
      info.reduceEnemyZl = this.reduceZl(skill, enemy)
    }

    return info
  }

  // 有几率增加自身攻击
  selfAddZl (skill, char, time) {

    let info = {time: 1500, show: ''}

    if (Math.floor(Math.random() * 100) < skill.change) {
      info = {time: time, show: skill.show}
      const addZl = this.addZl(skill, char)
      info.addZl = addZl;
      this.setSkilledStatus(char)
    }

    return info
  }

  /**
   * 通用方法
   * @param {*} skill 
   * @param {*} char 
   * @returns 战力值
   */
  // 增加战力
  addZl (skill, char) {
    const addZl = Math.ceil(char.current_zl * skill.level / 100)
    char.current_zl = char.current_zl + addZl
    return addZl
  }


  /**
   * 通用方法
   * @param {*} skill 
   * @param {*} char 
   * @returns 战力值
   */
  // 减少战力
  reduceZl (skill, char) {
    const reduceZl = Math.ceil(char.current_zl * skill.level / 100)
    char.current_zl = char.current_zl - reduceZl
    return reduceZl
  }

  /**
   * 通用方法
   * @param {*} skill 
   * @param {*} char 
   * @returns 战力值群体总值
   */
  // 群体减少战力
  reduceZlGroup (skill, charList) {
    let totalZl = 0
    for(let i=0; i<charList.length; i++) {
      const reduceZl = Math.ceil(charList[0].current_zl * skill.level / 100)
      totalZl += reduceZl
      charList[i].current_zl = charList[i].current_zl  - reduceZl
    }
    return totalZl
  }
}
