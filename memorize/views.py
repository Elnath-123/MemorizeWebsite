from django.http import response
from django.shortcuts import render, redirect
from django.shortcuts import HttpResponse
from .voc import User, All_voc, Review, connectDB
from sqlalchemy.sql import operators
from django.views.decorators.csrf import csrf_exempt
import json
from sqlalchemy.orm import join
import memorize.cfg as cfg
import math

def row2dict(row):
    d = {}
    for column in row.__table__.columns:
        d[column.name] = str(getattr(row, column.name))
    return d


# 登录页面
def login(request):
    # 指定要访问的页面，render的功能：讲请求的页面结果提交给客户端
    return render(request, 'login.html')


# 注册页面
def register(request):
    return render(request, 'register.html')

# 设置页面
def setting(request):
    return render(request, 'setting.html')

def toMainPage(request):
    return render(request, "app.html")

# 背诵页面
def memorize_in(request):
    # 指定要访问的页面，render的功能：讲请求的页面结果提交给客户端
    return render(request, 'memorize_in.html')

def memorize(request):
    print("hello")
    # 指定要访问的页面，render的功能：讲请求的页面结果提交给客户端
    return render(request, 'memorize.html')

#测验页面
def test_in(request):
    # 指定要访问的页面，render的功能：讲请求的页面结果提交给客户端
    return render(request, 'test_in.html')

def test(request):
    # 指定要访问的页面，render的功能：讲请求的页面结果提交给客户端
    return render(request, 'test.html')

#中英互译
def translation(request):
    # 指定要访问的页面，render的功能：讲请求的页面结果提交给客户端
    return render(request, 'translation.html')


@csrf_exempt
def save_set(request):
    a = request.POST  # 获取post()请求
    # print(a)
    # 通过get()请求获取前段提交的数据
    oldpwd = a.get('old_pwd')
    newpwd = a.get('new_pwd')
    plan_num = a.get('plan_num')
    vocab_type = a.get('vocab_type')
    vocab_type = cfg.__C[vocab_type]
    print("vocab_type number: {}".format(vocab_type))
    print("plan_num: {}".format(plan_num))

    dburl = 'mysql+mysqlconnector://root:990721@localhost:3306/voc'
    DBSession = connectDB(dburl)
    session = DBSession()
    userName = request.session.get('user_id')
    print("setting User: {}".format(userName))
    user = session.query(User).filter(User.user_id == userName).one()
    print("setting query : {}".format(user))
    user.sel_thesaurus = vocab_type
    user.plan_vocnum = plan_num

    if newpwd:
        if user.user_pwd != oldpwd:
            return HttpResponse(json.dumps({"setting": cfg.OLD_PWD_ERROR}))
        else:
            user.user_pwd = newpwd
    
    session.commit()
    session.close()
    return HttpResponse(json.dumps({"setting": cfg.SET_SUCCESS}))

# 定义一个函数，用来保存注册的数据
@csrf_exempt
def save(request):
    a = request.POST  # 获取post请求
    # print(a)
    # 通过get()请求获取前段提交的数据
    userName = a.get('username')
    passWord = a.get('password')
    print(userName)
    print(passWord)
    dburl = 'mysql+mysqlconnector://root:990721@localhost:3306/voc'
    DBSession = connectDB(dburl)
    session = DBSession()

    users = session.query(User).filter(User.user_id == userName).all()

    for item in users:
        if item:
            # 表示该账号已经存在
            session.close()
            return HttpResponse(json.dumps({"register": cfg.USER_EXIST}))
            
    new_user = User(user_id=userName, user_pwd=passWord)
    # 添加到session:
    session.add(new_user)
    # 提交即保存到数据库:
    session.commit()
    # 关闭session:
    session.close()
    return HttpResponse(json.dumps({"register": cfg.REG_SUCCESS}))

@csrf_exempt
def query(request):
    print("success")
    a = request.POST
    userName = a.get('username')
    passWord = a.get('password')
    request.session['user_id'] = userName
    # 创建session对象:
    dburl = 'mysql+mysqlconnector://root:990721@localhost:3306/voc'
    DBSession = connectDB(dburl)
    session = DBSession()
    print(userName)
    print(passWord)
    try:
        user = session.query(User).filter(User.user_id == userName).one()
    except Exception:
        print("error")
        return HttpResponse(json.dumps({"login": cfg.USER_NOTEXIST}))
    finally:
        session.close()
    print(user.user_pwd)

    if user.user_pwd == passWord:
        # 设置cookie和session
        res = HttpResponse(json.dumps({"login": cfg.LOGIN_SUCCESS}))
        res.set_cookie("username", userName, expires=cfg.COOKIE_EXPIRE)
        res.set_cookie("password", passWord, expires=cfg.COOKIE_EXPIRE)
        return res
    else:
        return HttpResponse(json.dumps({"login": cfg.PWD_INCORRECT}))
    session.close()

@csrf_exempt
def memorize_in_handler(request):
    dburl = 'mysql+mysqlconnector://root:990721@localhost:3306/voc'
    DBSession = connectDB(dburl)
    session = DBSession()
    userName = request.session.get('user_id')
    user = session.query(User).filter(User.user_id == userName).one()
    if(not user.sel_thesaurus):
        return HttpResponse(json.dumps({"memorize_in" : cfg.NOT_SELECT_VOCAB}))
    else:
        return HttpResponse(json.dumps({"memorize_in" : cfg.MEM_IN_SUCCESS}))

@csrf_exempt
def memorize_out_handler(request):
    dburl = 'mysql+mysqlconnector://root:990721@localhost:3306/voc'
    DBSession = connectDB(dburl)
    session = DBSession()
    userName = request.session.get('user_id')
    user = session.query(User).filter(User.user_id == userName).one()
    print("userName:" + userName)
    a = request.POST
    words = json.loads(a.get("words"))
    sel_vocab = user.sel_thesaurus
    print(words)
    #复习的旧单词处理
    review_word = words["review"]
    #拿出所有指数大于3的单词，由于复习库没有变，因此这里的vocab与memorize_handler中的vocab一致
    #因此可以直接更新
    vocab = session.query(Review).filter(Review.index >= 3).all()
    new_review_word = []
    for i in range(len(vocab)):
        # 如果指数小于等于0， 则从复习单词表中删除
        if(vocab[i].index <= 0):
            session.query(Review).filter(vocab[i].voc_id == review_word[i]["id"]).delete()
            session.commit()
        else:
            session.query(Review).filter(vocab[i].voc_id == review_word[i]["id"]).update({"index": review_word[i]["index"]})
            session.commit()

    #背诵的新单词处理，
    vocab = session.query(All_voc).filter(operators.op(All_voc.thesaurus, '&', user.sel_thesaurus)).all()
    curr_num = user.com_vocnum
    
    recite_word = words["recite"]
    recite_num = words["recite_num"]
    user.com_vocnum += recite_num
    print("recite words: {}".format(recite_word))
    print("curr_num:" + str(curr_num))
    # 将背诵错误的单词加入复习单词表，指数再多增加1
    new_review_word = []
    for i in range(curr_num, curr_num + recite_num):
        # 如果这个单词背诵错误
        print(recite_word[i - curr_num])
        if(recite_word[i - curr_num]["index"] > 0):
            new_review_word.append(Review(voc_id=vocab[i].voc_id, user_id=user.user_id, index=recite_word[i - curr_num]["index"] + 1))
    print("new_review_word" + str(new_review_word))
    # 将复习单词表中其他单词指数+1
    review_vocab = session.query(Review).all()
    for i in range(len(review_vocab)):
        review_vocab[i].index += 1

    session.add_all(new_review_word)
    session.add_all(review_vocab)
    session.commit()
    recite_num = words["recite_num"]
    user.com_vocnum += recite_num
    if user.com_vocnum == recite_num:
        return HttpResponse(json.dumps({"memorize_out": cfg.MEM_FINISH_VOCAB}))
    return HttpResponse(json.dumps({"memorize_out" : cfg.MEM_OUT_SUCCESS}))
        

@csrf_exempt
def memorize_handler(request):
    vocab_type = {1: '四级词汇', 2: '六级词汇', 4: '托福词汇', 8: 'GRE词汇'}
    a = request.GET
    dburl = 'mysql+mysqlconnector://root:990721@localhost:3306/voc'
    DBSession = connectDB(dburl)
    session = DBSession()
    userName = request.session.get('user_id')
    user = session.query(User).filter(User.user_id == userName).one()
    recite_dict= []  # 背诵列表
    review_dict = []  # 复习列表
    review_num = 0
    # 处理要背诵的单词
    recitevoc = session.query(All_voc).filter(operators.op(All_voc.thesaurus, '&', user.sel_thesaurus)).all()
    # print("recite: {}".format(recitevoc[0].__class__))
    left_num = len(recitevoc) - user.com_vocnum
    for i in range(min(left_num, user.plan_vocnum)):
        voc_dict0 = row2dict(recitevoc[user.com_vocnum + i])
        print(voc_dict0)
        voc_dict = {}
        voc_dict['id'] = voc_dict0['voc_id']
        voc_dict['word'] = voc_dict0['spelling']
        voc_dict['pron'] = voc_dict0['pronunciation']
        voc_dict['word'] = voc_dict0['spelling']
        voc_dict['correct'] = voc_dict0['translation']
        voc_dict['index'] = 0
        #voc_dict = row2dict(recitevoc[user.com_vocnum + i])
        #voc_dict['index'] = 0
        recite_dict.append(voc_dict)  ## 使用 append() 添加元素

    # 处理要复习的单词
    reviewvoc = session.query(All_voc.voc_id, All_voc.spelling, All_voc.pronunciation, All_voc.translation, \
                              Review.index).filter(All_voc.voc_id == Review.voc_id, Review.user_id == userName).all()
    # print("review : {}".format(reviewvoc[0].__class__))
    for item in reviewvoc:
        if item.index >= 2.9:
            item_dict = {}
            item_dict["id"] = item[0]
            item_dict["word"] = item[1]
            item_dict["pron"] = item[2]
            item_dict["correct"] = item[3]
            item_dict["index"] = item[4]
            review_dict.append(item_dict)  ## 使用 append() 添加元素
            review_num += 1
    session.close()
    # print(review_list)
    words = {}
    words['vocab_type'] = vocab_type[user.sel_thesaurus]  # 词库种类
    words['review_num'] = review_num  # 复习单词个数
    words['recite_num'] = user.plan_vocnum  # 背诵单词个数
    words['review'] = review_dict   # 复习但系
    words['recite'] = recite_dict  #背诵单词
    print(words)
    if(left_num <= user.plan_vocnum):
        complete = True
    return HttpResponse(json.dumps({"words": words, "complete": True}))


def setup(request):
    a = request.GET
    newpwd= a.get('passward')
    newtype = a.get('voctype')
    dburl = 'mysql+mysqlconnector://root:990721@localhost:3306/voc'
    DBSession = connectDB(dburl)
    session = DBSession()
    userName = request.session.get('user_id')
    user = session.query(User).filter(User.user_id == userName).one()


